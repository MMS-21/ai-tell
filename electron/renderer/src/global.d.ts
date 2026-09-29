interface Window {
  api: {
    openFile: (filters: any) => Promise<string | null>;
    openFiles: (filters: any) => Promise<string[]>;
    saveFile: (defaultName: string, filters?: any) => Promise<string | null>;
    analyze: (options: any) => Promise<any>;
    clean: (options: any) => Promise<any>;
    revise: (options: any) => Promise<any>;
    verify: (options: any) => Promise<any>;
    audit: (options: any) => Promise<any>;
    baseline: (action: string, name: string, files: string[]) => Promise<any>;
  };
}
