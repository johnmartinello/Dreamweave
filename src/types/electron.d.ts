declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      getAppName: () => Promise<string>;
      exportData: (jsonString: string) => Promise<{ success: boolean; filePath?: string; cancelled?: boolean; error?: string }>;
      importData: () => Promise<{ success: boolean; data?: string; cancelled?: boolean; error?: string }>;
    };
  }
}

export {};
