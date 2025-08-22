declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      getAppName: () => Promise<string>;
      saveDreamData: (data: any) => Promise<void>;
      loadDreamData: () => Promise<any>;
      exportDreams: (data: any, format: string) => Promise<void>;
      importDreams: (filePath: string) => Promise<any>;
    };
  }
}

export {};
