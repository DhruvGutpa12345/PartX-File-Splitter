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

  // Theme & Notifications
  getSystemTheme: () => ipcRenderer.invoke('theme:getSystemTheme'),
  setThemeSource: (source) => ipcRenderer.invoke('theme:setSource', source),
  showNotification: (opts) => ipcRenderer.invoke('notification:show', opts),
  deleteFiles: (files) => ipcRenderer.invoke('file:deleteFiles', files),
  writeText: (data) => ipcRenderer.invoke('file:writeText', data),

  // Event Listeners
  onSystemThemeChanged: (callback) => {
    const subscription = (event, value) => callback(value);
    ipcRenderer.on('theme:systemChanged', subscription);
    return () => ipcRenderer.removeListener('theme:systemChanged', subscription);
  },
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
