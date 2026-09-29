const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // File dialogs
  openFile: (filters) => ipcRenderer.invoke('dialog:openFile', filters),
  openFiles: (filters) => ipcRenderer.invoke('dialog:openFiles', filters),
  saveFile: (defaultName, filters) => ipcRenderer.invoke('dialog:saveFile', filters),
  showMessage: (options) => ipcRenderer.invoke('dialog:showMessage', options),

  // API calls to Python backend
  analyze: (params) => ipcRenderer.invoke('api:analyze', params),
  clean: (options) => ipcRenderer.invoke('api:clean', options),
  revise: (options) => ipcRenderer.invoke('api:revise', options),
  verify: (options) => ipcRenderer.invoke('api:verify', options),
  audit: (options) => ipcRenderer.invoke('api:audit', options),
  baseline: (action, name, files) => ipcRenderer.invoke('api:baseline', { action, name, files }),
  health: () => ipcRenderer.invoke('api:health'),

  // Progress events
  onProgress: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('progress', listener);
    return () => ipcRenderer.removeListener('progress', listener);
  }
});