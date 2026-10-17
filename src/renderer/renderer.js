// ============================================================
// PARTX RENDERER - MODERN FLUENT ENGINE CONTROLLER
// ============================================================

// --- DOM ELEMENTS: HEADER & NAVIGATION ---
const themeOptButtons = document.querySelectorAll('.theme-opt');
const historyBtn = document.getElementById('historyBtn');
const historyBadge = document.getElementById('historyBadge');
const historyDrawer = document.getElementById('historyDrawer');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const toastContainer = document.getElementById('toastContainer');

const tabSplitBtn = document.getElementById('tabSplitBtn');
const tabJoinBtn = document.getElementById('tabJoinBtn');
const tabChecksumBtn = document.getElementById('tabChecksumBtn');
const tabCompareBtn = document.getElementById('tabCompareBtn');
const tabManifestBtn = document.getElementById('tabManifestBtn');

const splitTab = document.getElementById('splitTab');
const joinTab = document.getElementById('joinTab');
const checksumTab = document.getElementById('checksumTab');
const compareTab = document.getElementById('compareTab');
const manifestTab = document.getElementById('manifestTab');

// --- DOM ELEMENTS: SPLIT TAB ---
const splitDropzone = document.getElementById('splitDropzone');
const splitFileBadge = document.getElementById('splitFileBadge');
const splitFileName = document.getElementById('splitFileName');
const splitFileMeta = document.getElementById('splitFileMeta');
const clearSplitFileBtn = document.getElementById('clearSplitFileBtn');
const splitModeRadios = document.querySelectorAll('input[name="splitMode"]');
const chunkSizeGroup = document.getElementById('chunkSizeGroup');
const partsCountGroup = document.getElementById('partsCountGroup');
const chunkSizeInput = document.getElementById('chunkSizeInput');
const chunkSizeUnit = document.getElementById('chunkSizeUnit');
const partsCountInput = document.getElementById('partsCountInput');
const namingSchemeSelect = document.getElementById('namingSchemeSelect');
const splitEstimatorBox = document.getElementById('splitEstimatorBox');
const estimatorSummaryText = document.getElementById('estimatorSummaryText');
const splitVisualStrip = document.getElementById('splitVisualStrip');
const splitOutputDirInput = document.getElementById('splitOutputDirInput');
const browseSplitOutputDirBtn = document.getElementById('browseSplitOutputDirBtn');
const createManifestCheckbox = document.getElementById('createManifestCheckbox');
const splitAutoOpenFolder = document.getElementById('splitAutoOpenFolder');
const splitNotifyOnFinish = document.getElementById('splitNotifyOnFinish');

const startSplitBtn = document.getElementById('startSplitBtn');
const splitActionContainer = document.getElementById('splitActionContainer');
const splitDashboard = document.getElementById('splitDashboard');
const splitProgressBar = document.getElementById('splitProgressBar');
const splitProgressPercent = document.getElementById('splitProgressPercent');
const splitProgressStatus = document.getElementById('splitProgressStatus');
const splitSpeed = document.getElementById('splitSpeed');
const splitEta = document.getElementById('splitEta');
const splitCurrentPart = document.getElementById('splitCurrentPart');
const pauseSplitBtn = document.getElementById('pauseSplitBtn');
const cancelSplitBtn = document.getElementById('cancelSplitBtn');
const splitAlert = document.getElementById('splitAlert');
const splitLogBox = document.getElementById('splitLogBox');

// --- DOM ELEMENTS: JOIN TAB ---
const joinDropzone = document.getElementById('joinDropzone');
const joinFileBadge = document.getElementById('joinFileBadge');
const joinFileName = document.getElementById('joinFileName');
const joinFileMeta = document.getElementById('joinFileMeta');
const clearJoinFileBtn = document.getElementById('clearJoinFileBtn');
const detectedPartsContainer = document.getElementById('detectedPartsContainer');
const detectedPartsSummary = document.getElementById('detectedPartsSummary');
const detectedPartsTbody = document.getElementById('detectedPartsTbody');
const joinOutputPathInput = document.getElementById('joinOutputPathInput');
const browseJoinOutputPathBtn = document.getElementById('browseJoinOutputPathBtn');
const joinExpectedShaInput = document.getElementById('joinExpectedShaInput');
const joinAutoOpenFolder = document.getElementById('joinAutoOpenFolder');
const joinNotifyOnFinish = document.getElementById('joinNotifyOnFinish');
const joinDeletePartsCheckbox = document.getElementById('joinDeletePartsCheckbox');

const startJoinBtn = document.getElementById('startJoinBtn');
const joinActionContainer = document.getElementById('joinActionContainer');
const joinDashboard = document.getElementById('joinDashboard');
const joinProgressBar = document.getElementById('joinProgressBar');
const joinProgressPercent = document.getElementById('joinProgressPercent');
const joinProgressStatus = document.getElementById('joinProgressStatus');
const joinSpeed = document.getElementById('joinSpeed');
const joinEta = document.getElementById('joinEta');
const joinCurrentPart = document.getElementById('joinCurrentPart');
const pauseJoinBtn = document.getElementById('pauseJoinBtn');
const cancelJoinBtn = document.getElementById('cancelJoinBtn');
const joinAlert = document.getElementById('joinAlert');
const joinLogBox = document.getElementById('joinLogBox');

// --- DOM ELEMENTS: CHECKSUM TAB ---
const checksumDropzone = document.getElementById('checksumDropzone');
const checksumFileBadge = document.getElementById('checksumFileBadge');
const checksumFileName = document.getElementById('checksumFileName');
const checksumFileMeta = document.getElementById('checksumFileMeta');
const clearChecksumFileBtn = document.getElementById('clearChecksumFileBtn');
const checksumProgressCard = document.getElementById('checksumProgressCard');
const checksumProgressBar = document.getElementById('checksumProgressBar');
const checksumProgressPercent = document.getElementById('checksumProgressPercent');
const checksumResultsCard = document.getElementById('checksumResultsCard');
const hashSha256Input = document.getElementById('hashSha256Input');
const hashSha1Input = document.getElementById('hashSha1Input');
const hashMd5Input = document.getElementById('hashMd5Input');
const copySha256Btn = document.getElementById('copySha256Btn');
const copySha1Btn = document.getElementById('copySha1Btn');
const copyMd5Btn = document.getElementById('copyMd5Btn');
const copyAllHashesBtn = document.getElementById('copyAllHashesBtn');
const exportChecksumBtn = document.getElementById('exportChecksumBtn');
const compareHashInput = document.getElementById('compareHashInput');
const compareHashBtn = document.getElementById('compareHashBtn');
const compareResultBadge = document.getElementById('compareResultBadge');

// --- DOM ELEMENTS: COMPARE TAB ---
const compareDropzoneA = document.getElementById('compareDropzoneA');
const compareFileBadgeA = document.getElementById('compareFileBadgeA');
const compareFileNameA = document.getElementById('compareFileNameA');
const compareFileMetaA = document.getElementById('compareFileMetaA');
const clearCompareFileBtnA = document.getElementById('clearCompareFileBtnA');

const compareDropzoneB = document.getElementById('compareDropzoneB');
const compareFileBadgeB = document.getElementById('compareFileBadgeB');
const compareFileNameB = document.getElementById('compareFileNameB');
const compareFileMetaB = document.getElementById('compareFileMetaB');
const clearCompareFileBtnB = document.getElementById('clearCompareFileBtnB');

const startCompareBtn = document.getElementById('startCompareBtn');
const cancelCompareBtn = document.getElementById('cancelCompareBtn');
const compareActionContainer = document.getElementById('compareActionContainer');
const compareDashboard = document.getElementById('compareDashboard');
const compareProgressBar = document.getElementById('compareProgressBar');
const compareProgressPercent = document.getElementById('compareProgressPercent');
const compareProgressStatus = document.getElementById('compareProgressStatus');
const compareProcessed = document.getElementById('compareProcessed');
const compareMetricsStatus = document.getElementById('compareMetricsStatus');
const compareAlert = document.getElementById('compareAlert');
const compareResultsCard = document.getElementById('compareResultsCard');
const compareHeroBanner = document.getElementById('compareHeroBanner');
const compareResultsTbody = document.getElementById('compareResultsTbody');
const copyCompareReportBtn = document.getElementById('copyCompareReportBtn');

// --- DOM ELEMENTS: MANIFEST TAB ---
const manifestDropzone = document.getElementById('manifestDropzone');
const manifestFileBadge = document.getElementById('manifestFileBadge');
const manifestFileName = document.getElementById('manifestFileName');
const manifestFileMeta = document.getElementById('manifestFileMeta');
const clearManifestFileBtn = document.getElementById('clearManifestFileBtn');

const startVerifyManifestBtn = document.getElementById('startVerifyManifestBtn');
const cancelManifestBtn = document.getElementById('cancelManifestBtn');
const manifestActionContainer = document.getElementById('manifestActionContainer');
const manifestDashboard = document.getElementById('manifestDashboard');
const manifestProgressBar = document.getElementById('manifestProgressBar');
const manifestProgressPercent = document.getElementById('manifestProgressPercent');
const manifestProgressStatus = document.getElementById('manifestProgressStatus');
const manifestCurrentIndex = document.getElementById('manifestCurrentIndex');
const manifestCurrentFilename = document.getElementById('manifestCurrentFilename');
const manifestAlert = document.getElementById('manifestAlert');
const manifestResultsCard = document.getElementById('manifestResultsCard');
const manifestResultsSummaryText = document.getElementById('manifestResultsSummaryText');
const manifestResultsTbody = document.getElementById('manifestResultsTbody');
const copyManifestReportBtn = document.getElementById('copyManifestReportBtn');

// --- OPERATIONAL STATE ---
let currentThemePreference = localStorage.getItem('partx_theme_pref') || 'system';
let activeSplitFile = null;
let activeJoinPartsInfo = null;
let activeChecksumFile = null;
let computedHashes = null;
let activeCompareFileA = null;
let activeCompareFileB = null;
let latestCompareResult = null;
let activeManifestFile = null;
let latestManifestResult = null;
let isOperationPaused = false;
let currentOperationType = null; // 'split' | 'join' | 'checksum' | 'compare' | 'manifest' | null

// ============================================================
// 1. THEME MANAGEMENT (SYSTEM, DARK, LIGHT)
// ============================================================

async function applyTheme(pref) {
  currentThemePreference = pref;
  localStorage.setItem('partx_theme_pref', pref);

  themeOptButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme-val') === pref);
  });

  if (window.api && window.api.setThemeSource) {
    await window.api.setThemeSource(pref);
  }

  let effectiveTheme = pref;
  if (pref === 'system') {
    if (window.api && window.api.getSystemTheme) {
      effectiveTheme = await window.api.getSystemTheme();
    } else {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }

  document.documentElement.setAttribute('data-theme', effectiveTheme);
}

themeOptButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.getAttribute('data-theme-val');
    applyTheme(val);
  });
});

if (window.api && window.api.onSystemThemeChanged) {
  window.api.onSystemThemeChanged((systemTheme) => {
    if (currentThemePreference === 'system') {
      document.documentElement.setAttribute('data-theme', systemTheme);
    }
  });
}

// Media query fallback for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (currentThemePreference === 'system') {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

// Initialize theme on load
applyTheme(currentThemePreference);

// ============================================================
// 2. TOAST NOTIFICATIONS & NATIVE ALERTS
// ============================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger reflow & show
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function notifyUser(title, body) {
  if (window.api && window.api.showNotification) {
    window.api.showNotification({ title, body });
  }
}

// ============================================================
// 3. OPERATION HISTORY DRAWER
// ============================================================

const HISTORY_STORAGE_KEY = 'partx_history_v1';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || [];
  } catch (_) {
    return [];
  }
}

function saveHistory(list) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  updateHistoryBadge();
}

function addHistoryItem(item) {
  const list = getHistory();
  const newItem = {
    id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString(),
    ...item
  };
  list.unshift(newItem);
  saveHistory(list);
  renderHistory();
}

function updateHistoryBadge() {
  const list = getHistory();
  if (list.length > 0) {
    historyBadge.textContent = list.length > 99 ? '99+' : list.length;
    historyBadge.style.display = 'inline-block';
  } else {
    historyBadge.style.display = 'none';
  }
}

function renderHistory() {
  const list = getHistory();
  historyList.innerHTML = '';

  if (list.length === 0) {
    historyList.innerHTML = `
      <div class="history-empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 10px; display: block; opacity: 0.4;">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <p>No recent operations recorded yet.</p>
      </div>
    `;
    return;
  }

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="history-card-top">
        <span class="history-type-badge history-type-${item.type}">${item.type}</span>
        <span class="history-time">${item.date} ${item.timestamp}</span>
      </div>
      <div class="history-file-title" title="${item.fileName}">${item.fileName}</div>
      <div class="history-details">${item.details}</div>
      ${item.hash ? `<div class="history-details font-mono" style="opacity: 0.75; font-size: 10px;" title="${item.hash}">SHA: ${item.hash.substring(0, 16)}...</div>` : ''}
      <div class="history-actions">
        ${item.targetPath ? `<button class="btn btn-secondary btn-sm reveal-btn" data-path="${item.targetPath}">Open Folder</button>` : ''}
        ${item.hash ? `<button class="btn btn-secondary btn-sm copy-hash-btn" data-hash="${item.hash}">Copy Hash</button>` : ''}
      </div>
    `;

    const revealBtn = card.querySelector('.reveal-btn');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        window.api.showItemInFolder(item.targetPath);
      });
    }

    const copyBtn = card.querySelector('.copy-hash-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(item.hash);
        showToast('SHA-256 copied to clipboard', 'success');
      });
    }

    historyList.appendChild(card);
  });
}

function toggleHistoryDrawer(open) {
  historyDrawer.classList.toggle('open', open);
  drawerBackdrop.classList.toggle('active', open);
  if (open) renderHistory();
}

historyBtn.addEventListener('click', () => toggleHistoryDrawer(true));
closeHistoryBtn.addEventListener('click', () => toggleHistoryDrawer(false));
drawerBackdrop.addEventListener('click', () => toggleHistoryDrawer(false));

clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Clear all operation history?')) {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    renderHistory();
    updateHistoryBadge();
    showToast('History cleared', 'info');
  }
});

updateHistoryBadge();

// ============================================================
// 4. TAB NAVIGATION
// ============================================================

function switchTab(target) {
  tabSplitBtn.classList.toggle('active', target === 'split');
  tabJoinBtn.classList.toggle('active', target === 'join');
  tabChecksumBtn.classList.toggle('active', target === 'checksum');
  tabCompareBtn.classList.toggle('active', target === 'compare');
  tabManifestBtn.classList.toggle('active', target === 'manifest');

  splitTab.classList.toggle('active', target === 'split');
  joinTab.classList.toggle('active', target === 'join');
  checksumTab.classList.toggle('active', target === 'checksum');
  compareTab.classList.toggle('active', target === 'compare');
  manifestTab.classList.toggle('active', target === 'manifest');
}

tabSplitBtn.addEventListener('click', () => switchTab('split'));
tabJoinBtn.addEventListener('click', () => switchTab('join'));
tabChecksumBtn.addEventListener('click', () => switchTab('checksum'));
tabCompareBtn.addEventListener('click', () => switchTab('compare'));
tabManifestBtn.addEventListener('click', () => switchTab('manifest'));

// Format utilities
function formatTime(seconds) {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showAlert(el, message, type = 'danger') {
  el.className = `alert-box alert-${type}`;
  el.textContent = message;
  el.style.display = 'block';
}

function hideAlert(el) {
  el.style.display = 'none';
  el.textContent = '';
}

function appendLog(box, message) {
  box.style.display = 'flex';
  const item = document.createElement('div');
  item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  box.appendChild(item);
  box.scrollTop = box.scrollHeight;
}

// Drag & drop helper
function setupDropzone(zone, onFileDropped) {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    zone.classList.remove('drag-over');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDropped(e.dataTransfer.files[0]);
    }
  });
}

// ============================================================
// 5. SPLIT TAB LOGIC & CHUNK VISUALIZER
// ============================================================

// Radio switch: size vs count
splitModeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'size') {
      chunkSizeGroup.style.display = 'flex';
      partsCountGroup.style.display = 'none';
    } else {
      chunkSizeGroup.style.display = 'none';
      partsCountGroup.style.display = 'flex';
    }
    updateSplitEstimator();
  });
});

// Presets
document.querySelectorAll('.preset-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const val = chip.getAttribute('data-val');
    const unit = chip.getAttribute('data-unit');
    chunkSizeInput.value = val;
    chunkSizeUnit.value = unit;
    const sizeRadio = document.querySelector('input[name="splitMode"][value="size"]');
    if (sizeRadio) {
      sizeRadio.checked = true;
      chunkSizeGroup.style.display = 'flex';
      partsCountGroup.style.display = 'none';
    }
    updateSplitEstimator();
  });
});

// Update visual preview of chunks
function updateSplitEstimator() {
  if (!activeSplitFile || activeSplitFile.size <= 0) {
    splitEstimatorBox.style.display = 'none';
    return;
  }

  const fileSize = activeSplitFile.size;
  const splitMode = document.querySelector('input[name="splitMode"]:checked').value;
  let totalParts = 0;
  let chunkSizeBytes = 0;

  if (splitMode === 'size') {
    const val = parseFloat(chunkSizeInput.value) || 0;
    const unit = chunkSizeUnit.value;
    const multipliers = { KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    chunkSizeBytes = Math.round(val * (multipliers[unit] || 1024 * 1024));
    if (chunkSizeBytes <= 0) {
      splitEstimatorBox.style.display = 'none';
      return;
    }
    totalParts = Math.ceil(fileSize / chunkSizeBytes);
  } else {
    totalParts = parseInt(partsCountInput.value, 10) || 0;
    if (totalParts < 2) {
      splitEstimatorBox.style.display = 'none';
      return;
    }
    chunkSizeBytes = Math.ceil(fileSize / totalParts);
  }

  if (totalParts <= 0) return;

  splitEstimatorBox.style.display = 'flex';
  estimatorSummaryText.textContent = `${totalParts} part(s) (~${formatBytes(chunkSizeBytes)} each)`;

  // Render visual strip (cap at 16 chunks for UI neatness)
  splitVisualStrip.innerHTML = '';
  const displayPartsCount = Math.min(totalParts, 16);
  for (let i = 1; i <= displayPartsCount; i++) {
    const chunkDiv = document.createElement('div');
    chunkDiv.className = 'visual-chunk';
    chunkDiv.textContent = `#${i}`;
    chunkDiv.title = `Part ${i} of ${totalParts}`;
    splitVisualStrip.appendChild(chunkDiv);
  }
}

chunkSizeInput.addEventListener('input', updateSplitEstimator);
chunkSizeUnit.addEventListener('change', updateSplitEstimator);
partsCountInput.addEventListener('input', updateSplitEstimator);

// Split File Selection
splitDropzone.addEventListener('click', async () => {
  const file = await window.api.openFile();
  if (file) handleSelectedSplitFile(file);
});

setupDropzone(splitDropzone, async (droppedFile) => {
  const meta = await window.api.getFileMeta(droppedFile.path);
  if (meta && !meta.isDirectory) {
    handleSelectedSplitFile(meta);
  } else {
    showAlert(splitAlert, 'Directories cannot be split directly. Please drop a file.', 'danger');
  }
});

function handleSelectedSplitFile(file) {
  hideAlert(splitAlert);
  activeSplitFile = file;
  splitFileName.textContent = file.name;
  splitFileMeta.textContent = `${file.formattedSize || formatBytes(file.size)} • ${file.path}`;
  splitDropzone.style.display = 'none';
  splitFileBadge.style.display = 'flex';

  if (!splitOutputDirInput.value) {
    const parentDir = file.path.substring(0, file.path.lastIndexOf('\\'));
    splitOutputDirInput.value = parentDir;
  }
  startSplitBtn.disabled = false;
  updateSplitEstimator();
}

clearSplitFileBtn.addEventListener('click', () => {
  activeSplitFile = null;
  splitFileBadge.style.display = 'none';
  splitDropzone.style.display = 'flex';
  splitEstimatorBox.style.display = 'none';
  startSplitBtn.disabled = true;
  hideAlert(splitAlert);
});

browseSplitOutputDirBtn.addEventListener('click', async () => {
  const dir = await window.api.openDirectory();
  if (dir) {
    splitOutputDirInput.value = dir.path;
  }
});

// Start Split Execution
startSplitBtn.addEventListener('click', async () => {
  if (!activeSplitFile) return;

  const outputDir = splitOutputDirInput.value.trim();
  if (!outputDir) {
    showAlert(splitAlert, 'Please select a valid output directory.', 'danger');
    return;
  }

  const splitMode = document.querySelector('input[name="splitMode"]:checked').value;
  let chunkSizeBytes = 0;
  let partsCount = 0;

  if (splitMode === 'size') {
    const val = parseFloat(chunkSizeInput.value);
    const unit = chunkSizeUnit.value;
    if (isNaN(val) || val <= 0) {
      showAlert(splitAlert, 'Please enter a valid chunk size.', 'danger');
      return;
    }
    const multipliers = { KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    chunkSizeBytes = Math.round(val * multipliers[unit]);
  } else {
    partsCount = parseInt(partsCountInput.value, 10);
    if (isNaN(partsCount) || partsCount < 2) {
      showAlert(splitAlert, 'Please specify at least 2 parts.', 'danger');
      return;
    }
  }

  hideAlert(splitAlert);
  splitLogBox.innerHTML = '';
  splitActionContainer.style.display = 'none';
  splitDashboard.style.display = 'flex';
  splitProgressBar.style.width = '0%';
  splitProgressPercent.textContent = '0%';
  splitProgressStatus.textContent = 'Splitting in progress...';
  currentOperationType = 'split';
  isOperationPaused = false;
  pauseSplitBtn.textContent = 'Pause';

  const namingPattern = namingSchemeSelect.value;
  const createManifest = createManifestCheckbox.checked;

  const result = await window.api.startSplit({
    sourcePath: activeSplitFile.path,
    outputDir,
    splitMode,
    chunkSizeBytes,
    partsCount,
    namingPattern,
    createManifest
  });

  currentOperationType = null;
  splitDashboard.style.display = 'none';
  splitActionContainer.style.display = 'flex';

  if (result.success) {
    const res = result.result;
    showAlert(
      splitAlert,
      `Successfully split "${res.originalFile}" into ${res.totalParts} parts! SHA-256: ${res.sha256}`,
      'success'
    );
    showToast(`Split complete: Created ${res.totalParts} parts`, 'success');

    // Add to history
    addHistoryItem({
      type: 'split',
      fileName: res.originalFile,
      details: `${res.totalParts} parts • ${formatBytes(res.originalSize)}`,
      targetPath: outputDir,
      hash: res.sha256
    });

    // Native notification
    if (splitNotifyOnFinish.checked) {
      notifyUser('PartX - File Split Complete', `"${res.originalFile}" was split into ${res.totalParts} parts.`);
    }

    // Auto-open destination folder
    if (splitAutoOpenFolder.checked) {
      window.api.showItemInFolder(res.manifestPath || outputDir);
    }
  } else {
    showAlert(splitAlert, `Split failed: ${result.error}`, 'danger');
    showToast('Split failed: ' + result.error, 'danger');
  }
});

// Pause / Resume / Cancel for Split
pauseSplitBtn.addEventListener('click', async () => {
  if (isOperationPaused) {
    await window.api.resumeOperation();
    isOperationPaused = false;
    pauseSplitBtn.textContent = 'Pause';
    splitProgressStatus.textContent = 'Splitting in progress...';
  } else {
    await window.api.pauseOperation();
    isOperationPaused = true;
    pauseSplitBtn.textContent = 'Resume';
    splitProgressStatus.textContent = 'Paused';
  }
});

cancelSplitBtn.addEventListener('click', async () => {
  await window.api.cancelOperation();
  splitProgressStatus.textContent = 'Cancelling...';
});

// ============================================================
// 6. JOIN TAB LOGIC
// ============================================================

joinDropzone.addEventListener('click', async () => {
  const file = await window.api.openFile();
  if (file) handleSelectedJoinFile(file.path);
});

setupDropzone(joinDropzone, (droppedFile) => {
  handleSelectedJoinFile(droppedFile.path);
});

async function handleSelectedJoinFile(filePath) {
  hideAlert(joinAlert);
  detectedPartsTbody.innerHTML = '';
  const detection = await window.api.detectParts(filePath);

  if (detection.error || !detection.parts || detection.parts.length === 0) {
    showAlert(joinAlert, `No valid split parts detected for file "${filePath}".`, 'danger');
    return;
  }

  activeJoinPartsInfo = detection;
  joinDropzone.style.display = 'none';
  joinFileBadge.style.display = 'flex';

  joinFileName.textContent = detection.baseOriginalName;
  joinFileMeta.textContent = `Found ${detection.totalParts} part(s) • Total: ${formatBytes(detection.totalCalculatedSize)}`;
  detectedPartsSummary.textContent = `${detection.totalParts} parts (${formatBytes(detection.totalCalculatedSize)})`;

  // Populate parts table
  detection.parts.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${p.partIndex}</strong></td>
      <td>${p.fileName}</td>
      <td>${formatBytes(p.size)}</td>
    `;
    detectedPartsTbody.appendChild(tr);
  });
  detectedPartsContainer.style.display = 'block';

  // Pre-fill destination path
  const defaultOutputPath = `${detection.outputDirectory}\\${detection.baseOriginalName}`;
  joinOutputPathInput.value = defaultOutputPath;

  // Pre-fill manifest SHA-256 if discovered
  if (detection.expectedSha256) {
    joinExpectedShaInput.value = detection.expectedSha256;
    showAlert(joinAlert, `Found SHA-256 manifest: Auto-populated expected hash.`, 'warning');
  } else {
    joinExpectedShaInput.value = '';
  }

  // Check for missing parts
  if (detection.missingParts && detection.missingParts.length > 0) {
    showAlert(
      joinAlert,
      `WARNING: Missing part(s) detected: [${detection.missingParts.join(', ')}]. Joining will produce a corrupted file!`,
      'danger'
    );
    startJoinBtn.disabled = true;
  } else {
    startJoinBtn.disabled = false;
  }
}

clearJoinFileBtn.addEventListener('click', () => {
  activeJoinPartsInfo = null;
  joinFileBadge.style.display = 'none';
  detectedPartsContainer.style.display = 'none';
  joinDropzone.style.display = 'flex';
  startJoinBtn.disabled = true;
  hideAlert(joinAlert);
});

browseJoinOutputPathBtn.addEventListener('click', async () => {
  const defaultName = activeJoinPartsInfo ? activeJoinPartsInfo.baseOriginalName : 'joined_file';
  const chosenPath = await window.api.saveFile(defaultName);
  if (chosenPath) {
    joinOutputPathInput.value = chosenPath;
  }
});

startJoinBtn.addEventListener('click', async () => {
  if (!activeJoinPartsInfo) return;

  const outputPath = joinOutputPathInput.value.trim();
  if (!outputPath) {
    showAlert(joinAlert, 'Please specify a destination file path.', 'danger');
    return;
  }

  hideAlert(joinAlert);
  joinLogBox.innerHTML = '';
  joinActionContainer.style.display = 'none';
  joinDashboard.style.display = 'flex';
  joinProgressBar.style.width = '0%';
  joinProgressPercent.textContent = '0%';
  joinProgressStatus.textContent = 'Recombining parts...';
  currentOperationType = 'join';
  isOperationPaused = false;
  pauseJoinBtn.textContent = 'Pause';

  const expectedSha256 = joinExpectedShaInput.value.trim();

  const result = await window.api.startJoin({
    partPaths: activeJoinPartsInfo.parts.map(p => p.fullPath),
    outputPath,
    expectedSha256: expectedSha256 || null
  });

  currentOperationType = null;
  joinDashboard.style.display = 'none';
  joinActionContainer.style.display = 'flex';

  if (result.success) {
    const res = result.result;
    let msg = `Successfully joined file into "${outputPath}" (${formatBytes(res.totalSize)}). SHA-256: ${res.actualSha256}`;
    
    if (res.hashVerified === true) {
      msg += `\nIntegrity Verified: SHA-256 matches manifest perfectly!`;
      showAlert(joinAlert, msg, 'success');
      showToast('Recombine complete: Hash verified 100%!', 'success');
    } else if (res.hashVerified === false) {
      msg += `\nWARNING: Checksum mismatch! Recombined file may be corrupted.`;
      showAlert(joinAlert, msg, 'danger');
      showToast('Checksum mismatch detected!', 'danger');
    } else {
      showAlert(joinAlert, msg, 'success');
      showToast('File recombined successfully!', 'success');
    }

    // Add to history
    addHistoryItem({
      type: 'join',
      fileName: activeJoinPartsInfo.baseOriginalName,
      details: `${activeJoinPartsInfo.totalParts} parts -> ${formatBytes(res.totalSize)}`,
      targetPath: outputPath,
      hash: res.actualSha256
    });

    // Native notification
    if (joinNotifyOnFinish.checked) {
      notifyUser('PartX - File Join Complete', `Recombined into "${activeJoinPartsInfo.baseOriginalName}".`);
    }

    // Auto-clean source parts if option checked & verified
    if (joinDeletePartsCheckbox.checked) {
      if (res.hashVerified !== false) {
        const toDelete = activeJoinPartsInfo.parts.map(p => p.fullPath);
        if (confirm(`Successfully rejoined! Delete ${toDelete.length} original split parts to reclaim disk space?`)) {
          const delRes = await window.api.deleteFiles(toDelete);
          if (delRes.success) {
            showToast(`Deleted ${delRes.deletedCount} source part files`, 'info');
          }
        }
      }
    }

    // Auto-open destination folder
    if (joinAutoOpenFolder.checked) {
      window.api.showItemInFolder(outputPath);
    }
  } else {
    showAlert(joinAlert, `Join failed: ${result.error}`, 'danger');
    showToast('Join failed: ' + result.error, 'danger');
  }
});

// Pause / Resume / Cancel for Join
pauseJoinBtn.addEventListener('click', async () => {
  if (isOperationPaused) {
    await window.api.resumeOperation();
    isOperationPaused = false;
    pauseJoinBtn.textContent = 'Pause';
    joinProgressStatus.textContent = 'Recombining in progress...';
  } else {
    await window.api.pauseOperation();
    isOperationPaused = true;
    pauseJoinBtn.textContent = 'Resume';
    joinProgressStatus.textContent = 'Paused';
  }
});

cancelJoinBtn.addEventListener('click', async () => {
  await window.api.cancelOperation();
  joinProgressStatus.textContent = 'Cancelling...';
});

// ============================================================
// 7. REAL-TIME EVENT HOOKS
// ============================================================

window.api.onProgress((data) => {
  const percentText = `${Math.floor(data.percent)}%`;
  const speedText = `${(data.speedBytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
  const etaText = formatTime(data.etaSeconds);
  const partText = `${data.currentPart} / ${data.totalParts}`;

  if (currentOperationType === 'split') {
    splitProgressBar.style.width = `${data.percent}%`;
    splitProgressPercent.textContent = percentText;
    splitSpeed.textContent = speedText;
    splitEta.textContent = etaText;
    splitCurrentPart.textContent = partText;
  } else if (currentOperationType === 'join') {
    joinProgressBar.style.width = `${data.percent}%`;
    joinProgressPercent.textContent = percentText;
    joinSpeed.textContent = speedText;
    joinEta.textContent = etaText;
    joinCurrentPart.textContent = partText;
  }
});

window.api.onLog((data) => {
  if (currentOperationType === 'split') {
    appendLog(splitLogBox, data.message);
  } else if (currentOperationType === 'join') {
    appendLog(joinLogBox, data.message);
  }
});

// ============================================================
// 8. CHECKSUM TAB LOGIC & EXPORT
// ============================================================

checksumDropzone.addEventListener('click', async () => {
  const file = await window.api.openFile();
  if (file) handleSelectedChecksumFile(file);
});

setupDropzone(checksumDropzone, async (droppedFile) => {
  const meta = await window.api.getFileMeta(droppedFile.path);
  if (meta && !meta.isDirectory) {
    handleSelectedChecksumFile(meta);
  }
});

clearChecksumFileBtn.addEventListener('click', () => {
  activeChecksumFile = null;
  computedHashes = null;
  checksumFileBadge.style.display = 'none';
  checksumDropzone.style.display = 'flex';
  checksumProgressCard.style.display = 'none';
  checksumResultsCard.style.display = 'none';
  compareHashInput.value = '';
  compareResultBadge.style.display = 'none';
});

async function handleSelectedChecksumFile(file) {
  activeChecksumFile = file;
  computedHashes = null;
  checksumFileName.textContent = file.name;
  checksumFileMeta.textContent = `${file.formattedSize || formatBytes(file.size)} • ${file.path}`;
  checksumDropzone.style.display = 'none';
  checksumFileBadge.style.display = 'flex';
  checksumResultsCard.style.display = 'none';
  compareHashInput.value = '';
  compareResultBadge.style.display = 'none';

  checksumProgressCard.style.display = 'block';
  checksumProgressBar.style.width = '0%';
  checksumProgressPercent.textContent = '0%';
  currentOperationType = 'checksum';

  const res = await window.api.computeChecksums(file.path);
  currentOperationType = null;
  checksumProgressCard.style.display = 'none';

  if (res.success) {
    computedHashes = res.result;
    hashSha256Input.value = computedHashes.sha256;
    hashSha1Input.value = computedHashes.sha1;
    hashMd5Input.value = computedHashes.md5;
    checksumResultsCard.style.display = 'block';
    showToast('Hashes calculated successfully!', 'success');

    // Add to history
    addHistoryItem({
      type: 'checksum',
      fileName: file.name,
      details: `${file.formattedSize || formatBytes(file.size)}`,
      targetPath: file.path,
      hash: computedHashes.sha256
    });
  } else {
    alert(`Failed to calculate checksum: ${res.error}`);
    clearChecksumFileBtn.click();
  }
}

// Copy Buttons
function setupCopyBtn(btn, inputEl, label) {
  btn.addEventListener('click', async () => {
    const val = inputEl.value;
    if (!val) return;
    await navigator.clipboard.writeText(val);
    showToast(`${label} copied to clipboard`, 'success');
  });
}

setupCopyBtn(copySha256Btn, hashSha256Input, 'SHA-256');
setupCopyBtn(copySha1Btn, hashSha1Input, 'SHA-1');
setupCopyBtn(copyMd5Btn, hashMd5Input, 'MD5');

// Copy All Hashes
copyAllHashesBtn.addEventListener('click', async () => {
  if (!computedHashes || !activeChecksumFile) return;
  const content = [
    `File: ${activeChecksumFile.name}`,
    `Size: ${activeChecksumFile.formattedSize || formatBytes(activeChecksumFile.size)}`,
    `SHA-256: ${computedHashes.sha256}`,
    `SHA-1:   ${computedHashes.sha1}`,
    `MD5:     ${computedHashes.md5}`
  ].join('\r\n');

  await navigator.clipboard.writeText(content);
  showToast('All hashes copied to clipboard', 'success');
});

// Export .sha256 manifest
exportChecksumBtn.addEventListener('click', async () => {
  if (!computedHashes || !activeChecksumFile) return;
  const defaultManifestName = `${activeChecksumFile.name}.sha256`;
  const savePath = await window.api.saveFile(defaultManifestName);
  if (!savePath) return;

  const manifestContent = `${computedHashes.sha256} *${activeChecksumFile.name}\r\n`;
  const writeRes = await window.api.writeText({ filePath: savePath, content: manifestContent });
  if (writeRes.success) {
    showToast(`Manifest saved: ${defaultManifestName}`, 'success');
  } else {
    alert(`Failed to save manifest: ${writeRes.error}`);
  }
});

// Compare Hashes
compareHashBtn.addEventListener('click', () => {
  if (!computedHashes) return;
  const input = compareHashInput.value.trim().toUpperCase();
  if (!input) {
    compareResultBadge.style.display = 'none';
    return;
  }

  compareResultBadge.style.display = 'block';
  if (input === computedHashes.sha256) {
    compareResultBadge.className = 'alert-box alert-success';
    compareResultBadge.textContent = 'MATCH: Input exactly matches computed SHA-256!';
    showToast('Match: SHA-256 verified!', 'success');
  } else if (input === computedHashes.sha1) {
    compareResultBadge.className = 'alert-box alert-success';
    compareResultBadge.textContent = 'MATCH: Input exactly matches computed SHA-1!';
    showToast('Match: SHA-1 verified!', 'success');
  } else if (input === computedHashes.md5) {
    compareResultBadge.className = 'alert-box alert-success';
    compareResultBadge.textContent = 'MATCH: Input exactly matches computed MD5!';
    showToast('Match: MD5 verified!', 'success');
  } else {
    compareResultBadge.className = 'alert-box alert-danger';
    compareResultBadge.textContent = 'MISMATCH: Input does NOT match any computed hash (SHA-256, SHA-1, MD5).';
    showToast('Mismatch: Hash does not match!', 'danger');
  }
});

window.api.onChecksumProgress((data) => {
  const percentText = `${Math.floor(data.percent)}%`;
  checksumProgressBar.style.width = `${data.percent}%`;
  checksumProgressPercent.textContent = percentText;
});

// ============================================================
// 9. FILE COMPARATOR (BIT-BY-BIT DIFF)
// ============================================================

function updateCompareButtonState() {
  startCompareBtn.disabled = !(activeCompareFileA && activeCompareFileB);
}

// File A Selection
compareDropzoneA.addEventListener('click', async () => {
  const file = await window.api.openFile();
  if (file) handleSelectedCompareFileA(file);
});

setupDropzone(compareDropzoneA, async (droppedFile) => {
  const meta = await window.api.getFileMeta(droppedFile.path);
  if (meta && !meta.isDirectory) {
    handleSelectedCompareFileA(meta);
  } else {
    showAlert(compareAlert, 'Please drop a valid file for File A.', 'danger');
  }
});

function handleSelectedCompareFileA(file) {
  hideAlert(compareAlert);
  activeCompareFileA = file;
  compareFileNameA.textContent = file.name;
  compareFileMetaA.textContent = `${file.formattedSize || formatBytes(file.size)} • ${file.path}`;
  compareDropzoneA.style.display = 'none';
  compareFileBadgeA.style.display = 'flex';
  compareResultsCard.style.display = 'none';
  updateCompareButtonState();
}

clearCompareFileBtnA.addEventListener('click', () => {
  activeCompareFileA = null;
  compareFileBadgeA.style.display = 'none';
  compareDropzoneA.style.display = 'flex';
  compareResultsCard.style.display = 'none';
  updateCompareButtonState();
});

// File B Selection
compareDropzoneB.addEventListener('click', async () => {
  const file = await window.api.openFile();
  if (file) handleSelectedCompareFileB(file);
});

setupDropzone(compareDropzoneB, async (droppedFile) => {
  const meta = await window.api.getFileMeta(droppedFile.path);
  if (meta && !meta.isDirectory) {
    handleSelectedCompareFileB(meta);
  } else {
    showAlert(compareAlert, 'Please drop a valid file for File B.', 'danger');
  }
});

function handleSelectedCompareFileB(file) {
  hideAlert(compareAlert);
  activeCompareFileB = file;
  compareFileNameB.textContent = file.name;
  compareFileMetaB.textContent = `${file.formattedSize || formatBytes(file.size)} • ${file.path}`;
  compareDropzoneB.style.display = 'none';
  compareFileBadgeB.style.display = 'flex';
  compareResultsCard.style.display = 'none';
  updateCompareButtonState();
}

clearCompareFileBtnB.addEventListener('click', () => {
  activeCompareFileB = null;
  compareFileBadgeB.style.display = 'none';
  compareDropzoneB.style.display = 'flex';
  compareResultsCard.style.display = 'none';
  updateCompareButtonState();
});

// Start Comparison Execution
startCompareBtn.addEventListener('click', async () => {
  if (!activeCompareFileA || !activeCompareFileB) return;

  hideAlert(compareAlert);
  compareActionContainer.style.display = 'none';
  compareDashboard.style.display = 'flex';
  compareProgressBar.style.width = '0%';
  compareProgressPercent.textContent = '0%';
  compareProgressStatus.textContent = 'Comparing binary streams bit-by-bit...';
  compareProcessed.textContent = '0 MB / ' + formatBytes(Math.max(activeCompareFileA.size, activeCompareFileB.size));
  compareMetricsStatus.textContent = 'Analyzing...';
  compareResultsCard.style.display = 'none';
  currentOperationType = 'compare';

  const res = await window.api.compareFiles(activeCompareFileA.path, activeCompareFileB.path);

  currentOperationType = null;
  compareDashboard.style.display = 'none';
  compareActionContainer.style.display = 'flex';

  if (!res.success) {
    showAlert(compareAlert, `Comparison failed: ${res.error}`, 'danger');
    showToast('Comparison failed: ' + res.error, 'danger');
    return;
  }

  const result = res.result;
  latestCompareResult = result;
  compareResultsCard.style.display = 'block';

  // Render Hero Banner
  if (result.identical) {
    compareHeroBanner.className = 'diff-hero-banner diff-identical';
    compareHeroBanner.innerHTML = `
      <div class="diff-hero-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <div class="diff-hero-content">
        <div class="diff-hero-title">100% IDENTICAL FILES</div>
        <div class="diff-hero-desc">Both files have matching lengths and identical binary byte content. SHA-256 and MD5 hashes match.</div>
      </div>
    `;
    showToast('Files are 100% identical!', 'success');
  } else if (result.sizeDifference) {
    compareHeroBanner.className = 'diff-hero-banner diff-mismatch';
    compareHeroBanner.innerHTML = `
      <div class="diff-hero-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="diff-hero-content">
        <div class="diff-hero-title">FILE SIZE MISMATCH</div>
        <div class="diff-hero-desc">File A is ${formatBytes(result.file1.size)} (${result.file1.size} bytes), but File B is ${formatBytes(result.file2.size)} (${result.file2.size} bytes).</div>
      </div>
    `;
    showToast('File size mismatch detected!', 'danger');
  } else {
    compareHeroBanner.className = 'diff-hero-banner diff-mismatch';
    compareHeroBanner.innerHTML = `
      <div class="diff-hero-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <div class="diff-hero-content">
        <div class="diff-hero-title">BINARY CONTENT DIFFERENCE DETECTED</div>
        <div class="diff-hero-desc">Files share identical length (${formatBytes(result.file1.size)}) but differ at byte offset #${result.diffOffset.toLocaleString()} (approx ${formatBytes(result.diffOffset)}).</div>
      </div>
    `;
    showToast('Binary content difference found!', 'danger');
  }

  // Populate comparison table
  compareResultsTbody.innerHTML = `
    <tr>
      <td><strong>Filename</strong></td>
      <td>${result.file1.name}</td>
      <td>${result.file2.name}</td>
    </tr>
    <tr>
      <td><strong>Exact File Size</strong></td>
      <td>${result.file1.size.toLocaleString()} bytes (${formatBytes(result.file1.size)})</td>
      <td>${result.file2.size.toLocaleString()} bytes (${formatBytes(result.file2.size)})</td>
    </tr>
    <tr>
      <td><strong>SHA-256 Checksum</strong></td>
      <td class="font-mono">${result.file1.sha256}</td>
      <td class="font-mono">${result.file2.sha256}</td>
    </tr>
    <tr>
      <td><strong>MD5 Checksum</strong></td>
      <td class="font-mono">${result.file1.md5}</td>
      <td class="font-mono">${result.file2.md5}</td>
    </tr>
    <tr>
      <td><strong>Comparison Verdict</strong></td>
      <td colspan="2">
        <span class="status-pill ${result.identical ? 'status-pill-ok' : 'status-pill-fail'}">
          ${result.identical ? 'MATCH' : 'MISMATCH'}
        </span>
        ${result.identical ? 'Bit-for-bit identical' : (result.diffOffset !== null ? `First difference at byte offset #${result.diffOffset.toLocaleString()}` : 'Different file sizes')}
      </td>
    </tr>
  `;

  // Add to history
  addHistoryItem({
    type: 'compare',
    fileName: `${result.file1.name} vs ${result.file2.name}`,
    details: result.identical ? '100% Identical' : (result.diffOffset !== null ? `Diff at offset #${result.diffOffset}` : 'Size mismatch'),
    targetPath: activeCompareFileA.path,
    hash: result.file1.sha256
  });
});

cancelCompareBtn.addEventListener('click', async () => {
  await window.api.cancelOperation();
  compareProgressStatus.textContent = 'Cancelling comparison...';
});

window.api.onCompareProgress((data) => {
  if (currentOperationType === 'compare') {
    const percent = Math.floor(data.percent);
    compareProgressBar.style.width = `${percent}%`;
    compareProgressPercent.textContent = `${percent}%`;
    compareProcessed.textContent = `${formatBytes(data.bytesProcessed)} / ${formatBytes(data.totalBytes)}`;
    compareMetricsStatus.textContent = data.speedBytesPerSec > 0 ? `${(data.speedBytesPerSec / (1024 * 1024)).toFixed(1)} MB/s` : 'Comparing...';
  }
});

copyCompareReportBtn.addEventListener('click', async () => {
  if (!latestCompareResult) return;
  const r = latestCompareResult;
  const report = [
    '================ PARTX COMPARISON REPORT ================',
    `Timestamp: ${new Date().toLocaleString()}`,
    `Verdict:   ${r.identical ? 'IDENTICAL (100% MATCH)' : 'DIFFERENT'}`,
    r.identical ? '' : (r.diffOffset !== null ? `Difference: Byte offset #${r.diffOffset.toLocaleString()}` : 'Difference: File lengths differ'),
    '',
    `FILE A: ${r.file1.name}`,
    `  Path:   ${r.file1.path}`,
    `  Size:   ${r.file1.size.toLocaleString()} bytes (${formatBytes(r.file1.size)})`,
    `  SHA256: ${r.file1.sha256}`,
    `  MD5:    ${r.file1.md5}`,
    '',
    `FILE B: ${r.file2.name}`,
    `  Path:   ${r.file2.path}`,
    `  Size:   ${r.file2.size.toLocaleString()} bytes (${formatBytes(r.file2.size)})`,
    `  SHA256: ${r.file2.sha256}`,
    `  MD5:    ${r.file2.md5}`,
    '========================================================='
  ].filter(line => line !== '').join('\r\n');

  await navigator.clipboard.writeText(report);
  showToast('Comparison report copied to clipboard', 'success');
});

// ============================================================
// 10. MANIFEST VERIFIER (.sha256 / .sfv / .md5)
// ============================================================

manifestDropzone.addEventListener('click', async () => {
  const file = await window.api.openFile([
    { name: 'Checksum Manifests', extensions: ['sha256', 'sfv', 'md5', 'txt'] },
    { name: 'All Files', extensions: ['*'] }
  ]);
  if (file) handleSelectedManifestFile(file);
});

setupDropzone(manifestDropzone, async (droppedFile) => {
  const meta = await window.api.getFileMeta(droppedFile.path);
  if (meta && !meta.isDirectory) {
    handleSelectedManifestFile(meta);
  } else {
    showAlert(manifestAlert, 'Please drop a checksum manifest file (.sha256, .sfv, or .md5).', 'danger');
  }
});

function handleSelectedManifestFile(file) {
  hideAlert(manifestAlert);
  activeManifestFile = file;
  manifestFileName.textContent = file.name;
  manifestFileMeta.textContent = `${file.formattedSize || formatBytes(file.size)} • ${file.path}`;
  manifestDropzone.style.display = 'none';
  manifestFileBadge.style.display = 'flex';
  manifestResultsCard.style.display = 'none';
  startVerifyManifestBtn.disabled = false;
}

clearManifestFileBtn.addEventListener('click', () => {
  activeManifestFile = null;
  manifestFileBadge.style.display = 'none';
  manifestDropzone.style.display = 'flex';
  manifestResultsCard.style.display = 'none';
  startVerifyManifestBtn.disabled = true;
  hideAlert(manifestAlert);
});

startVerifyManifestBtn.addEventListener('click', async () => {
  if (!activeManifestFile) return;

  hideAlert(manifestAlert);
  manifestActionContainer.style.display = 'none';
  manifestDashboard.style.display = 'flex';
  manifestProgressBar.style.width = '0%';
  manifestProgressPercent.textContent = '0%';
  manifestProgressStatus.textContent = 'Verifying manifest entries...';
  manifestCurrentIndex.textContent = '0 / --';
  manifestCurrentFilename.textContent = 'Scanning...';
  manifestResultsCard.style.display = 'none';
  currentOperationType = 'manifest';

  const res = await window.api.verifyManifest(activeManifestFile.path);

  currentOperationType = null;
  manifestDashboard.style.display = 'none';
  manifestActionContainer.style.display = 'flex';

  if (!res.success) {
    showAlert(manifestAlert, `Manifest verification failed: ${res.error}`, 'danger');
    showToast('Verification failed: ' + res.error, 'danger');
    return;
  }

  const result = res.result;
  latestManifestResult = result;
  manifestResultsCard.style.display = 'block';

  // Summary Text & Alert
  manifestResultsSummaryText.textContent = `${result.passed} of ${result.total} files passed (${result.failed} failed, ${result.missing} missing) • Format: ${result.manifestType}`;

  if (result.failed === 0 && result.missing === 0) {
    showAlert(manifestAlert, `All ${result.total} files successfully verified against manifest! 100% integrity confirmed.`, 'success');
    showToast(`All ${result.total} files verified successfully!`, 'success');
  } else {
    showAlert(manifestAlert, `Verification finished with warnings: ${result.passed} passed, ${result.failed} checksum mismatches, ${result.missing} missing files.`, 'danger');
    showToast(`Verification completed: ${result.failed + result.missing} issue(s) detected`, 'danger');
  }

  // Populate Table
  manifestResultsTbody.innerHTML = '';
  result.results.forEach(entry => {
    const tr = document.createElement('tr');
    let pillClass = 'status-pill-ok';
    let pillText = 'OK';
    if (entry.status === 'missing') {
      pillClass = 'status-pill-missing';
      pillText = 'MISSING';
    } else if (entry.status === 'fail') {
      pillClass = 'status-pill-fail';
      pillText = 'FAIL';
    }

    tr.innerHTML = `
      <td><span class="status-pill ${pillClass}">${pillText}</span></td>
      <td><strong>${entry.fileName}</strong></td>
      <td>${entry.size !== null ? formatBytes(entry.size) : '--'}</td>
      <td class="font-mono">${entry.expectedHash || '--'}</td>
      <td class="font-mono">${entry.actualHash || '--'}</td>
    `;
    manifestResultsTbody.appendChild(tr);
  });

  // Add to history
  addHistoryItem({
    type: 'manifest',
    fileName: activeManifestFile.name,
    details: `${result.passed}/${result.total} verified (${result.manifestType})`,
    targetPath: activeManifestFile.path
  });
});

cancelManifestBtn.addEventListener('click', async () => {
  await window.api.cancelOperation();
  manifestProgressStatus.textContent = 'Cancelling verification...';
});

window.api.onManifestProgress((data) => {
  if (currentOperationType === 'manifest') {
    const percent = Math.floor(data.percent);
    manifestProgressBar.style.width = `${percent}%`;
    manifestProgressPercent.textContent = `${percent}%`;
    manifestCurrentIndex.textContent = `${data.currentIndex} / ${data.totalFiles}`;
    manifestCurrentFilename.textContent = data.currentFile || '--';
  }
});

copyManifestReportBtn.addEventListener('click', async () => {
  if (!latestManifestResult) return;
  const r = latestManifestResult;
  const lines = [
    '================ PARTX MANIFEST VERIFICATION REPORT ================',
    `Manifest: ${activeManifestFile.name}`,
    `Format:   ${r.manifestType}`,
    `Summary:  ${r.passed}/${r.total} Passed (${r.failed} Failed, ${r.missing} Missing)`,
    `Time:     ${new Date().toLocaleString()}`,
    '---------------------------------------------------------------------'
  ];

  r.results.forEach(entry => {
    lines.push(`[${entry.status.toUpperCase()}] ${entry.fileName} - Expected: ${entry.expectedHash} | Actual: ${entry.actualHash || 'N/A'}`);
  });
  lines.push('=====================================================================');

  await navigator.clipboard.writeText(lines.join('\r\n'));
  showToast('Manifest verification report copied', 'success');
});

