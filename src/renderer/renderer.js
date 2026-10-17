// DOM Elements - Theme & Tabs
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const tabSplitBtn = document.getElementById('tabSplitBtn');
const tabJoinBtn = document.getElementById('tabJoinBtn');
const tabChecksumBtn = document.getElementById('tabChecksumBtn');
const splitTab = document.getElementById('splitTab');
const joinTab = document.getElementById('joinTab');
const checksumTab = document.getElementById('checksumTab');

// DOM Elements - Split Tab
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
const splitOutputDirInput = document.getElementById('splitOutputDirInput');
const browseSplitOutputDirBtn = document.getElementById('browseSplitOutputDirBtn');
const createManifestCheckbox = document.getElementById('createManifestCheckbox');
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

// DOM Elements - Join Tab
const joinDropzone = document.getElementById('joinDropzone');
const joinFileBadge = document.getElementById('joinFileBadge');
const joinFileName = document.getElementById('joinFileName');
const joinFileMeta = document.getElementById('joinFileMeta');
const clearJoinFileBtn = document.getElementById('clearJoinFileBtn');
const detectedPartsContainer = document.getElementById('detectedPartsContainer');
const detectedPartsTbody = document.getElementById('detectedPartsTbody');
const joinOutputPathInput = document.getElementById('joinOutputPathInput');
const browseJoinOutputPathBtn = document.getElementById('browseJoinOutputPathBtn');
const joinExpectedShaInput = document.getElementById('joinExpectedShaInput');
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

// DOM Elements - Checksum Tab
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
const compareHashInput = document.getElementById('compareHashInput');
const compareHashBtn = document.getElementById('compareHashBtn');
const compareResultBadge = document.getElementById('compareResultBadge');

// Operational State
let currentTheme = 'dark';
let activeSplitFile = null;
let activeJoinPartsInfo = null;
let activeChecksumFile = null;
let computedHashes = null;
let isOperationPaused = false;
let currentOperationType = null; // 'split' | 'join' | 'checksum' | null

// Theme Toggle
themeToggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'light') {
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  } else {
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
  }
});

// Tab Navigation
function switchTab(target) {
  tabSplitBtn.classList.toggle('active', target === 'split');
  tabJoinBtn.classList.toggle('active', target === 'join');
  tabChecksumBtn.classList.toggle('active', target === 'checksum');
  splitTab.classList.toggle('active', target === 'split');
  joinTab.classList.toggle('active', target === 'join');
  checksumTab.classList.toggle('active', target === 'checksum');
}

tabSplitBtn.addEventListener('click', () => switchTab('split'));
tabJoinBtn.addEventListener('click', () => switchTab('join'));
tabChecksumBtn.addEventListener('click', () => switchTab('checksum'));

// Quick Preset Chips for Chunk Size
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
  });
});

// Format Seconds into mm:ss
function formatTime(seconds) {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Format Bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Notification Alert Helper
function showAlert(el, message, type = 'danger') {
  el.className = `alert-box alert-${type}`;
  el.textContent = message;
  el.style.display = 'block';
}

function hideAlert(el) {
  el.style.display = 'none';
  el.textContent = '';
}

// Append log item
function appendLog(box, message) {
  box.style.display = 'flex';
  const item = document.createElement('div');
  item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  box.appendChild(item);
  box.scrollTop = box.scrollHeight;
}

// --- SPLIT TAB LOGIC ---

splitModeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'size') {
      chunkSizeGroup.style.display = 'flex';
      partsCountGroup.style.display = 'none';
    } else {
      chunkSizeGroup.style.display = 'none';
      partsCountGroup.style.display = 'flex';
    }
  });
});

// Split File Pickers
splitDropzone.addEventListener('click', async () => {
  const file = await window.api.openFile();
  if (file) handleSelectedSplitFile(file);
});

// Drag and drop for Split
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
}

clearSplitFileBtn.addEventListener('click', () => {
  activeSplitFile = null;
  splitFileBadge.style.display = 'none';
  splitDropzone.style.display = 'flex';
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
    showAlert(
      splitAlert,
      `Successfully split "${result.result.originalFile}" into ${result.result.totalParts} parts! SHA-256: ${result.result.sha256}`,
      'success'
    );
  } else {
    showAlert(splitAlert, `Split failed: ${result.error}`, 'danger');
  }
});

// Split Pause / Resume / Cancel
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

// --- JOIN TAB LOGIC ---

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
    showAlert(joinAlert, `Found SHA-256 manifest: Automatically populated expected hash.`, 'warning');
  } else {
    joinExpectedShaInput.value = '';
  }

  // Check for missing parts
  if (detection.missingParts && detection.missingParts.length > 0) {
    showAlert(
      joinAlert,
      `WARNING: Missing part(s) detected: [${detection.missingParts.join(', ')}]. Joining will result in corrupted output!`,
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
    let msg = `Successfully joined file into "${outputPath}" (${formatBytes(result.result.totalSize)}). SHA-256: ${result.result.actualSha256}`;
    if (result.result.hashVerified === true) {
      msg += `\nIntegrity Verified: SHA-256 matches expected checksum!`;
      showAlert(joinAlert, msg, 'success');
    } else if (result.result.hashVerified === false) {
      msg += `\nWARNING: Checksum mismatch! Recombined file may be corrupted.`;
      showAlert(joinAlert, msg, 'danger');
    } else {
      showAlert(joinAlert, msg, 'success');
    }
  } else {
    showAlert(joinAlert, `Join failed: ${result.error}`, 'danger');
  }
});

// Join Pause / Resume / Cancel
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

// --- REAL-TIME EVENT HOOKS ---

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
      const droppedFile = e.dataTransfer.files[0];
      onFileDropped(droppedFile);
    }
  });
}

// --- CHECKSUM / VERIFY TAB LOGIC ---

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
  } else {
    alert(`Failed to calculate checksum: ${res.error}`);
    clearChecksumFileBtn.click();
  }
}

// Copy Buttons
function setupCopyBtn(btn, inputEl) {
  btn.addEventListener('click', async () => {
    const val = inputEl.value;
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = originalText; }, 1500);
    } catch (_) {}
  });
}

setupCopyBtn(copySha256Btn, hashSha256Input);
setupCopyBtn(copySha1Btn, hashSha1Input);
setupCopyBtn(copyMd5Btn, hashMd5Input);

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
  } else if (input === computedHashes.sha1) {
    compareResultBadge.className = 'alert-box alert-success';
    compareResultBadge.textContent = 'MATCH: Input exactly matches computed SHA-1!';
  } else if (input === computedHashes.md5) {
    compareResultBadge.className = 'alert-box alert-success';
    compareResultBadge.textContent = 'MATCH: Input exactly matches computed MD5!';
  } else {
    compareResultBadge.className = 'alert-box alert-danger';
    compareResultBadge.textContent = 'MISMATCH: Input does NOT match any of SHA-256, SHA-1, or MD5 checksums.';
  }
});

// Checksum real-time progress
window.api.onChecksumProgress((data) => {
  const percentText = `${Math.floor(data.percent)}%`;
  checksumProgressBar.style.width = `${data.percent}%`;
  checksumProgressPercent.textContent = percentText;
});
