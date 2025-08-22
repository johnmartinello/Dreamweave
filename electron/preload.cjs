const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppName: () => ipcRenderer.invoke('get-app-name'),
  
  // File system operations (if needed for DreamWeave data)
  // You can add more methods here as needed for your DreamWeave app
  
  // Example: Save dream data to local file
  saveDreamData: (data) => ipcRenderer.invoke('save-dream-data', data),
  
  // Example: Load dream data from local file
  loadDreamData: () => ipcRenderer.invoke('load-dream-data'),
  
  // Example: Export dreams to file
  exportDreams: (data, format) => ipcRenderer.invoke('export-dreams', data, format),
  
  // Example: Import dreams from file
  importDreams: (filePath) => ipcRenderer.invoke('import-dreams', filePath)
});

// Handle any errors
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
