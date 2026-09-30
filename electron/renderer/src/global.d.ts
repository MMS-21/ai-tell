// Status stream pushed from the main process via `updater:status`
interface UpdaterStatus {
  state: 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'installing' | 'error';
  version?: string;
  currentVersion?: string;
  percent?: number;
  transferred?: number;
  total?: number;
  message?: string;
}

// Result of updaterCheck
interface UpdaterCheckResult {
  state: 'available' | 'not-available' | 'disabled' | 'error';
  version?: string;
  currentVersion?: string;
  message?: string;
}

// Result of updaterDownload / updaterInstall
interface UpdaterActionResult {
  state: 'downloading' | 'downloaded' | 'installing' | 'disabled' | 'error';
  version?: string;
  message?: string;
}

interface Window {
  api: {
    openFile: (filters?: any) => Promise<string | null>;
    openFiles: (filters?: any) => Promise<string[]>;
    saveFile: (defaultName: string, filters?: any) => Promise<string | null>;
    showMessage: (options: any) => Promise<any>;
    analyze: (options: any) => Promise<any>;
    clean: (options: any) => Promise<any>;
    revise: (options: any) => Promise<any>;
    verify: (options: any) => Promise<any>;
    audit: (options: any) => Promise<any>;
    baseline: (action: string, name: string, files: string[]) => Promise<any>;
    health: () => Promise<{ status: string }>;
    getVersion: () => Promise<string>;
    updaterCheck: () => Promise<UpdaterCheckResult>;
    updaterDownload: () => Promise<UpdaterActionResult>;
    updaterInstall: () => Promise<UpdaterActionResult>;
    onProgress: (callback: (data: any) => void) => () => void;
    onUpdaterStatus: (callback: (status: UpdaterStatus) => void) => () => void;
  };
}
