const { app, BrowserWindow, ipcMain, dialog, shell, nativeTheme, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

// Optimize Chromium startup and rendering performance
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-breakpad');
app.commandLine.appendSwitch('disable-component-update');

const {
  splitFile,
  detectSplitParts,
  joinFiles,
  computeFileChecksums,
  OperationController,
  formatBytes,
  getFreeDiskSpace
} = require('../engine/engine');

let mainWindow = null;
let activeController = null;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.exit(0);
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
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
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      spellcheck: false
    }
  });

  mainWindow.removeMenu();

  const indexPath = path.join(__dirname, '../renderer/index.html');
  mainWindow.loadFile(indexPath).catch(err => {
    console.error('Failed to load file:', err);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const onThemeUpdated = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('theme:systemChanged', nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
    }
  };
  nativeTheme.on('updated', onThemeUpdated);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.on('closed', () => {
    nativeTheme.removeListener('updated', onThemeUpdated);
    mainWindow = null;
    if (activeController) {
      try { activeController.cancel(); } catch (_) {}
    }
    app.exit(0);
  });
}

if (gotTheLock) {
  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    app.exit(0);
  });
}


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

// Calculate file checksums (SHA-256, SHA-1, MD5)
ipcMain.handle('op:computeChecksums', async (event, filePath) => {
  activeController = new OperationController();

  const sendProgress = (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('op:checksumProgress', data);
    }
  };

  try {
    const result = await computeFileChecksums(filePath, sendProgress, activeController);
    activeController = null;
    return { success: true, result };
  } catch (error) {
    activeController = null;
    return { success: false, error: error.message };
  }
});

// Theme IPC Handlers
ipcMain.handle('theme:getSystemTheme', () => {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
});

ipcMain.handle('theme:setSource', (event, source) => {
  if (['system', 'dark', 'light'].includes(source)) {
    nativeTheme.themeSource = source;
    return true;
  }
  return false;
});

// Native Notification Helper
ipcMain.handle('notification:show', (event, { title, body }) => {
  if (Notification.isSupported()) {
    const iconPath = path.join(__dirname, '../../build/icon.png');
    const notif = new Notification({
      title: title || 'PartX',
      body: body || '',
      icon: fs.existsSync(iconPath) ? iconPath : undefined
    });
    notif.show();
    return true;
  }
  return false;
});

// Safe batch file deletion (for cleaning up split parts after successful rejoining)
ipcMain.handle('file:deleteFiles', async (event, filePaths) => {
  if (!Array.isArray(filePaths)) return { success: false, error: 'Invalid file list' };
  let deletedCount = 0;
  for (const fp of filePaths) {
    try {
      if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
        deletedCount++;
      }
    } catch (_) {}
  }
  return { success: true, deletedCount };
});

// Write text file (e.g. exporting checksum files or manifests)
ipcMain.handle('file:writeText', async (event, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

