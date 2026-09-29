const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';

let pythonProcess = null;
let mainWindow = null;
let pythonPort = 8765;
let pythonReady = false;

function getPythonExecutable() {
  if (isDev) {
    return path.join(__dirname, '../python/.venv/Scripts/python.exe');
  }
  // In production, use the PyInstaller bundled executable
  return path.join(process.resourcesPath, 'python', 'aitell-backend.exe');
}

function getPythonScript() {
  if (isDev) {
    return path.join(__dirname, '../python/server.py');
  }
  // In production, the script is bundled into the executable
  return null;
}

function startPythonBackend() {
  return new Promise((resolve, reject) => {
    let pythonExe = getPythonExecutable();
    const scriptPath = getPythonScript();
    
    const args = scriptPath ? [scriptPath] : [];
    
    console.log(`Starting Python: ${pythonExe} ${args.join(' ')}`);
    
    // Verify the exe exists before spawning (gives a better error if missing)
    if (!fs.existsSync(pythonExe)) {
      return reject(new Error(`Python backend not found at: ${pythonExe}\nPlease reinstall the app to a path without spaces, or ensure the file exists.`));
    }
    
    pythonProcess = spawn(pythonExe, args, {
      env: { 
        ...process.env, 
        AITELL_PORT: pythonPort.toString(),
        NO_COLOR: '1',
        TERM: 'dumb'
      },
      windowsHide: true
    });

    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Python] ${output}`);
      if (output.includes('Uvicorn running on') || output.includes('Application startup complete')) {
        pythonReady = true;
        resolve();
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      const output = data.toString();
      console.error(`[Python Error] ${output}`);
      if (output.includes('Uvicorn running on') || output.includes('Application startup complete')) {
        pythonReady = true;
        resolve();
      }
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonReady = false;
    });

    pythonProcess.on('error', (err) => {
      console.error(`Failed to start Python: ${err}`);
      reject(err);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!pythonReady) {
        reject(new Error('Python backend failed to start within 30 seconds'));
      }
    }, 30000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    icon: path.join(__dirname, '../assets/icon.ico'),
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
    backgroundColor: '#fafafa'
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'renderer/dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(async () => {
  try {
    await startPythonBackend();
    createWindow();
  } catch (err) {
    console.error('Failed to start app:', err);
    dialog.showErrorBox('Startup Error', `Failed to start Python backend:\n${err.message}`);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('dialog:openFile', async (event, filters) => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters || [
      { name: 'Documents', extensions: ['docx', 'tex', 'pdf', 'md', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('dialog:saveFile', async (event, defaultName, filters) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
    filters: filters || [
      { name: 'Documents', extensions: ['docx', 'json', 'zip'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePath || null;
});

ipcMain.handle('dialog:showMessage', async (event, options) => {
  if (!mainWindow) return;
  return dialog.showMessageBox(mainWindow, options);
});

// API proxy to Python backend
async function proxyToPython(endpoint, method = 'POST', body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300000); // 5 min timeout
  
  try {
    const response = await fetch(`http://127.0.0.1:${pythonPort}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HTTP ${response.status}: ${err}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new Error('Request timeout (5 min)');
    throw err;
  }
}

ipcMain.handle('api:analyze', async (event, { filepath, baseline, json_output }) => {
  return proxyToPython('/analyze', 'POST', { filepath, baseline, json_output });
});

ipcMain.handle('api:clean', async (event, options) => {
  return proxyToPython('/clean', 'POST', options);
});

ipcMain.handle('api:revise', async (event, options) => {
  return proxyToPython('/revise', 'POST', options);
});

ipcMain.handle('api:verify', async (event, options) => {
  return proxyToPython('/verify', 'POST', options);
});

ipcMain.handle('api:audit', async (event, options) => {
  return proxyToPython('/audit', 'POST', options);
});

ipcMain.handle('api:baseline', async (event, { action, name, files }) => {
  return proxyToPython(`/baseline/${action}`, 'POST', { name, files });
});

ipcMain.handle('api:health', async () => {
  try {
    const res = await fetch(`http://127.0.0.1:${pythonPort}/health`);
    return res.ok ? { status: 'ok' } : { status: 'error' };
  } catch {
    return { status: 'unavailable' };
  }
});

// File dialog for multiple files
ipcMain.handle('dialog:openFiles', async (event, filters) => {
  if (!mainWindow) return [];
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: filters || [
      { name: 'Documents', extensions: ['docx', 'tex', 'pdf', 'md', 'txt'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePaths || [];
});

// Progress events from Python (if using SSE)
ipcMain.on('progress', (event, data) => {
  if (mainWindow) {
    mainWindow.webContents.send('progress', data);
  }
});