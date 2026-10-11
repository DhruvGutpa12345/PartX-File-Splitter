const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const {
  splitFile,
  detectSplitParts,
  joinFiles,
  computeSha256,
  OperationController,
  formatBytes,
  getFreeDiskSpace
} = require('../engine/engine');

let mainWindow = null;
let activeController = null;

// Single instance lock to prevent duplicate conflicting instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 740,
    minWidth: 840,
    minHeight: 620,
    title: 'PartX - File Splitter & Joiner',
    backgroundColor: '#0f172a',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0f172a',
      symbolColor: '#94a3b8',
      height: 38
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (activeController) {
      try { activeController.cancel(); } catch (_) {}
    }
    app.quit();
    setTimeout(() => {
      app.exit(0);
      process.exit(0);
    }, 150);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
  app.exit(0);
  process.exit(0);
});

app.on('will-quit', () => {
  if (activeController) {
    try { activeController.cancel(); } catch (_) {}
  }
});



// --- IPC HANDLERS ---

// Open single file dialog
ipcMain.handle('dialog:openFile', async (event, filters) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters || [{ name: 'All Files', extensions: ['*'] }]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  const filePath = result.filePaths[0];
  const stat = fs.statSync(filePath);
  return {
    path: filePath,
    name: path.basename(filePath),
    size: stat.size,
    formattedSize: formatBytes(stat.size)
  };
});

// Open directory dialog
ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  const dirPath = result.filePaths[0];
  const freeSpace = getFreeDiskSpace(dirPath);
  return {
    path: dirPath,
    freeSpace,
    formattedFreeSpace: freeSpace !== null ? formatBytes(freeSpace) : 'Unknown'
  };
});

// Save file dialog for Joined output
ipcMain.handle('dialog:saveFile', async (event, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName || 'recombined_file',
    properties: ['showOverwriteConfirmation']
  });
  return result.canceled ? null : result.filePath;
});

// Get file metadata (used when file is dragged and dropped)
ipcMain.handle('file:getMeta', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    const freeSpace = getFreeDiskSpace(path.dirname(filePath));
    return {
      path: filePath,
      name: path.basename(filePath),
      dir: path.dirname(filePath),
      size: stat.size,
      formattedSize: formatBytes(stat.size),
      isDirectory: stat.isDirectory(),
      freeSpace,
      formattedFreeSpace: freeSpace !== null ? formatBytes(freeSpace) : 'Unknown'
    };
  } catch (err) {
    return null;
  }
});

// Detect parts from a selected file
ipcMain.handle('file:detectParts', async (event, filePath) => {
  try {
    return detectSplitParts(filePath);
  } catch (err) {
    return { error: err.message, code: err.code };
  }
});

// Open path in Windows File Explorer
ipcMain.handle('shell:showItemInFolder', async (event, targetPath) => {
  if (fs.existsSync(targetPath)) {
    shell.showItemInFolder(targetPath);
    return true;
  }
  return false;
});

// Start Split Operation
ipcMain.handle('op:startSplit', async (event, options) => {
  activeController = new OperationController();

  const sendProgress = (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('op:progress', data);
    }
  };

  const sendLog = (message) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('op:log', { message, timestamp: new Date().toLocaleTimeString() });
    }
  };

  try {
    const result = await splitFile({
      ...options,
      controller: activeController,
      onProgress: sendProgress,
      onLog: sendLog
    });
    activeController = null;
    return { success: true, result };
  } catch (error) {
    activeController = null;
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
});

// Start Join Operation
ipcMain.handle('op:startJoin', async (event, options) => {
  activeController = new OperationController();

  const sendProgress = (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('op:progress', data);
    }
  };

  const sendLog = (message) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('op:log', { message, timestamp: new Date().toLocaleTimeString() });
    }
  };

  try {
    const result = await joinFiles({
      ...options,
      controller: activeController,
      onProgress: sendProgress,
      onLog: sendLog
    });
    activeController = null;
    return { success: true, result };
  } catch (error) {
    activeController = null;
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
});

// Control commands: Pause, Resume, Cancel
ipcMain.handle('op:pause', async () => {
  if (activeController) {
    activeController.pause();
    return true;
  }
  return false;
});

ipcMain.handle('op:resume', async () => {
  if (activeController) {
    activeController.resume();
    return true;
  }
  return false;
});

ipcMain.handle('op:cancel', async () => {
  if (activeController) {
    activeController.cancel();
    return true;
  }
  return false;
});
