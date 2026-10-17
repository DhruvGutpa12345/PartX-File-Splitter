const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Dialogs
  openFile: (filters) => ipcRenderer.invoke('dialog:openFile', filters),
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  saveFile: (defaultName) => ipcRenderer.invoke('dialog:saveFile', defaultName),

  // File metadata & inspection
  getFileMeta: (filePath) => ipcRenderer.invoke('file:getMeta', filePath),
  detectParts: (filePath) => ipcRenderer.invoke('file:detectParts', filePath),
  showItemInFolder: (path) => ipcRenderer.invoke('shell:showItemInFolder', path),

  // Operations
  startSplit: (options) => ipcRenderer.invoke('op:startSplit', options),
  startJoin: (options) => ipcRenderer.invoke('op:startJoin', options),
  pauseOperation: () => ipcRenderer.invoke('op:pause'),
  resumeOperation: () => ipcRenderer.invoke('op:resume'),
  cancelOperation: () => ipcRenderer.invoke('op:cancel'),
  computeChecksums: (filePath) => ipcRenderer.invoke('op:computeChecksums', filePath),

  // Event Listeners
  onProgress: (callback) => {
    const subscription = (event, value) => callback(value);
    ipcRenderer.on('op:progress', subscription);
    return () => ipcRenderer.removeListener('op:progress', subscription);
  },
  onLog: (callback) => {
    const subscription = (event, value) => callback(value);
    ipcRenderer.on('op:log', subscription);
    return () => ipcRenderer.removeListener('op:log', subscription);
  },
  onChecksumProgress: (callback) => {
    const subscription = (event, value) => callback(value);
    ipcRenderer.on('op:checksumProgress', subscription);
    return () => ipcRenderer.removeListener('op:checksumProgress', subscription);
  }
});
