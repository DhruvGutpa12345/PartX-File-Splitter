const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

/**
 * Custom operational error with specific code
 */
class EngineError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'EngineError';
    this.code = code;
  }
}

/**
 * Controller class to manage pausing and cancellation of operations
 */
class OperationController {
  constructor() {
    this.isPaused = false;
    this.isCancelled = false;
    this._pausePromise = null;
    this._resolvePause = null;
  }

  pause() {
    if (!this.isPaused && !this.isCancelled) {
      this.isPaused = true;
      this._pausePromise = new Promise((resolve) => {
        this._resolvePause = resolve;
      });
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      if (this._resolvePause) {
        this._resolvePause();
        this._pausePromise = null;
        this._resolvePause = null;
      }
    }
  }

  cancel() {
    this.isCancelled = true;
    if (this.isPaused && this._resolvePause) {
      this.isPaused = false;
      this._resolvePause();
      this._pausePromise = null;
      this._resolvePause = null;
    }
  }

  async checkWait() {
    if (this.isCancelled) {
      throw new EngineError('Operation cancelled by user.', 'CANCELLED');
    }
    if (this.isPaused && this._pausePromise) {
      await this._pausePromise;
      if (this.isCancelled) {
        throw new EngineError('Operation cancelled by user.', 'CANCELLED');
      }
    }
  }
}

/**
 * Check free disk space for a given target path (Windows PowerShell fallback)
 * Returns free bytes or null if undetectable
 */
function getFreeDiskSpace(targetPath) {
  try {
    const resolvedPath = path.resolve(targetPath);
    if (fs.statfsSync) {
      const stats = fs.statfsSync(resolvedPath);
      return stats.bavail * stats.bsize;
    }
    return null;
  } catch {
    return null;
  }
}


/**
 * Formats byte size into human readable string
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
/**
 * Computes multiple checksums (SHA-256, SHA-1, MD5) for a file simultaneously in a single stream pass
 */
async function computeFileChecksums(filePath, onProgress = null, controller = null) {
  return new Promise((resolve, reject) => {
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (err) {
      return reject(new EngineError(`Cannot access file: ${err.message}`, 'FILE_NOT_FOUND'));
    }

    const totalBytes = stat.size;
    let processedBytes = 0;
    const sha256 = crypto.createHash('sha256');
    const sha1 = crypto.createHash('sha1');
    const md5 = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath, { highWaterMark: 4 * 1024 * 1024 });

    stream.on('data', async (chunk) => {
      if (controller) {
        if (controller.isCancelled) {
          stream.destroy();
          return reject(new EngineError('Operation cancelled by user.', 'CANCELLED'));
        }
        if (controller.isPaused) {
          stream.pause();
          try {
            await controller.checkWait();
            stream.resume();
          } catch (e) {
            stream.destroy();
            return reject(e);
          }
        }
      }

      sha256.update(chunk);
      sha1.update(chunk);
      md5.update(chunk);
      processedBytes += chunk.length;
      if (onProgress && totalBytes > 0) {
        onProgress({
          processedBytes,
          totalBytes,
          percent: Math.min(100, (processedBytes / totalBytes) * 100)
        });
      }
    });

    stream.on('error', (err) => {
      reject(new EngineError(`Read error during hash: ${err.message}`, err.code || 'READ_ERROR'));
    });

    stream.on('end', () => {
      resolve({
        sha256: sha256.digest('hex').toUpperCase(),
        sha1: sha1.digest('hex').toUpperCase(),
        md5: md5.digest('hex').toUpperCase(),
        size: totalBytes,
        formattedSize: formatBytes(totalBytes)
      });
    });
  });
}


/**
 * Core Split Engine
 * 
 * @param {Object} options
 * @param {string} options.sourcePath Source file path
 * @param {string} options.outputDir Target directory
 * @param {'size'|'count'} options.splitMode Split method
 * @param {number} [options.chunkSizeBytes] Size per chunk in bytes
 * @param {number} [options.partsCount] Total number of parts
 * @param {'part'|'numeric'} [options.namingPattern] '.part1' or '.001'
 * @param {boolean} [options.createManifest] Generate .sfv / sha256 manifest
 * @param {OperationController} [options.controller] Pause/cancel controller
 * @param {Function} [options.onProgress] Callback for progress updates
 * @param {Function} [options.onLog] Callback for status logs
 */
async function splitFile(options) {
  const {
    sourcePath,
    outputDir,
    splitMode = 'size',
    chunkSizeBytes = 100 * 1024 * 1024,
    partsCount = 2,
    namingPattern = 'numeric', // 'numeric' -> .001 or 'part' -> .part1
    createManifest = true,
    controller = new OperationController(),
    onProgress = () => {},
    onLog = () => {}
  } = options;

  // 1. Validate Source File
  if (!fs.existsSync(sourcePath)) {
    throw new EngineError(`Source file does not exist: "${sourcePath}"`, 'FILE_NOT_FOUND');
  }

  let sourceStat;
  try {
    sourceStat = fs.statSync(sourcePath);
  } catch (err) {
    if (err.code === 'EBUSY' || err.code === 'EPERM') {
      throw new EngineError(`Source file is locked or access is denied: "${sourcePath}"`, 'FILE_LOCKED');
    }
    throw new EngineError(`Cannot read source file: ${err.message}`, err.code || 'UNKNOWN');
  }

  if (sourceStat.isDirectory()) {
    throw new EngineError(`Source path is a directory, not a file.`, 'INVALID_SOURCE');
  }

  const totalFileSize = sourceStat.size;
  if (totalFileSize === 0) {
    throw new EngineError('Cannot split an empty 0-byte file.', 'EMPTY_FILE');
  }

  // 2. Validate & ensure Output Directory
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  } catch (err) {
    throw new EngineError(`Cannot create output directory: ${err.message}`, 'OUTPUT_DIR_ERROR');
  }

  // 3. Disk Space Check
  const freeSpace = getFreeDiskSpace(outputDir);
  if (freeSpace !== null && freeSpace < totalFileSize + 1024 * 1024) {
    throw new EngineError(
      `Insufficient disk space in output location. Required: ${formatBytes(totalFileSize)}, Available: ${formatBytes(freeSpace)}.`,
      'DISK_SPACE_LOW'
    );
  }

  // 4. Calculate chunk sizes and part count
  let calculatedChunkSize = 0;
  let totalParts = 0;

  if (splitMode === 'count') {
    if (!partsCount || partsCount < 2) {
      throw new EngineError('Number of parts must be at least 2.', 'INVALID_PARTS_COUNT');
    }
    totalParts = Math.min(partsCount, totalFileSize);
    calculatedChunkSize = Math.ceil(totalFileSize / totalParts);
  } else {
    if (!chunkSizeBytes || chunkSizeBytes <= 0) {
      throw new EngineError('Chunk size must be greater than 0 bytes.', 'INVALID_CHUNK_SIZE');
    }
    calculatedChunkSize = chunkSizeBytes;
    totalParts = Math.ceil(totalFileSize / calculatedChunkSize);
  }

  const fileName = path.basename(sourcePath);
  onLog(`Starting split for "${fileName}" (${formatBytes(totalFileSize)}) into ${totalParts} parts...`);

  // Helper function to format part extension
  function getPartExtension(index, total) {
    if (namingPattern === 'part') {
      return `.part${index}`;
    }
    // numeric: .001, .002
    const padding = Math.max(3, String(total).length);
    return `.${String(index).padStart(padding, '0')}`;
  }

  // Tracking progress and metrics
  let totalBytesProcessed = 0;
  const startTime = Date.now();
  let lastSpeedCheckTime = startTime;
  let lastSpeedBytes = 0;
  let currentSpeed = 0; // Bytes/sec

  const createdPartPaths = [];
  const partHashes = [];
  const wholeFileHash = crypto.createHash('sha256');

  // Buffer chunk size for high-speed I/O (4 MB buffer)
  const BUFFER_SIZE = 4 * 1024 * 1024;
  const buffer = Buffer.alloc(BUFFER_SIZE);

  let sourceFd = null;
  try {
    sourceFd = fs.openSync(sourcePath, 'r');
  } catch (err) {
    if (err.code === 'EBUSY' || err.code === 'EPERM') {
      throw new EngineError(`Source file is locked by another process: "${sourcePath}"`, 'FILE_LOCKED');
    }
    throw new EngineError(`Failed to open source file: ${err.message}`, err.code || 'OPEN_ERROR');
  }

  try {
    for (let partIndex = 1; partIndex <= totalParts; partIndex++) {
      await controller.checkWait();

      const partExt = getPartExtension(partIndex, totalParts);
      const partFilename = `${fileName}${partExt}`;
      const partPath = path.join(outputDir, partFilename);
      createdPartPaths.push(partPath);

      onLog(`Creating part ${partIndex}/${totalParts}: ${partFilename}`);

      const partHash = crypto.createHash('sha256');
      let partFd = null;
      try {
        partFd = fs.openSync(partPath, 'w');
      } catch (err) {
        throw new EngineError(`Failed to create part file "${partFilename}": ${err.message}`, err.code || 'WRITE_ERROR');
      }

      let bytesWrittenForPart = 0;
      const targetPartSize = (partIndex === totalParts)
        ? (totalFileSize - (partIndex - 1) * calculatedChunkSize)
        : calculatedChunkSize;

      try {
        while (bytesWrittenForPart < targetPartSize && totalBytesProcessed < totalFileSize) {
          await controller.checkWait();

          const bytesToRead = Math.min(BUFFER_SIZE, targetPartSize - bytesWrittenForPart);
          const bytesRead = fs.readSync(sourceFd, buffer, 0, bytesToRead, totalBytesProcessed);

          if (bytesRead === 0) break; // EOF reached

          const chunk = buffer.subarray(0, bytesRead);
          fs.writeSync(partFd, chunk, 0, bytesRead);

          // Update Hashes
          partHash.update(chunk);
          wholeFileHash.update(chunk);

          bytesWrittenForPart += bytesRead;
          totalBytesProcessed += bytesRead;

          // Compute instantaneous speed & ETA
          const now = Date.now();
          const elapsedSinceCheck = (now - lastSpeedCheckTime) / 1000;
          if (elapsedSinceCheck >= 0.5) {
            const bytesDelta = totalBytesProcessed - lastSpeedBytes;
            currentSpeed = bytesDelta / elapsedSinceCheck;
            lastSpeedCheckTime = now;
            lastSpeedBytes = totalBytesProcessed;
          }

          const remainingBytes = totalFileSize - totalBytesProcessed;
          const etaSeconds = currentSpeed > 0 ? Math.ceil(remainingBytes / currentSpeed) : 0;
          const progressPercent = Math.min(100, (totalBytesProcessed / totalFileSize) * 100);

          onProgress({
            currentPart: partIndex,
            totalParts,
            processedBytes: totalBytesProcessed,
            totalBytes: totalFileSize,
            percent: progressPercent,
            speedBytesPerSec: currentSpeed,
            etaSeconds
          });
        }
      } finally {
        if (partFd !== null) {
          fs.closeSync(partFd);
        }
      }

      partHashes.push({
        part: partIndex,
        fileName: partFilename,
        size: bytesWrittenForPart,
        sha256: partHash.digest('hex').toUpperCase()
      });
    }

    const originalSha256 = wholeFileHash.digest('hex').toUpperCase();

    // 5. Generate Manifest / Checksum file
    let manifestPath = null;
    if (createManifest) {
      manifestPath = path.join(outputDir, `${fileName}.sha256`);
      const manifestLines = [
        `# PartX File Splitter & Joiner Manifest`,
        `# Original File: ${fileName}`,
        `# Original Size: ${totalFileSize} bytes (${formatBytes(totalFileSize)})`,
        `# Original SHA-256: ${originalSha256}`,
        `# Created: ${new Date().toISOString()}`,
        `# Total Parts: ${totalParts}`,
        `# Part Naming Scheme: ${namingPattern}`,
        ``,
        `# Part Details:`,
        ...partHashes.map(p => `${p.sha256} *${p.fileName} (${formatBytes(p.size)})`),
        ``,
        `# Standard Checksum Entry for Original File:`,
        `${originalSha256} *${fileName}`
      ];
      fs.writeFileSync(manifestPath, manifestLines.join('\r\n'), 'utf8');
      onLog(`Generated SHA-256 manifest: ${path.basename(manifestPath)}`);
    }

    onLog(`Splitting completed successfully! Created ${totalParts} parts.`);
    return {
      success: true,
      originalFile: fileName,
      originalSize: totalFileSize,
      sha256: originalSha256,
      parts: partHashes,
      manifestPath,
      totalParts
    };
  } catch (error) {
    // If operation was cancelled, clean up partial files
    if (error.code === 'CANCELLED') {
      onLog('Split cancelled. Cleaning up partial output files...');
      for (const p of createdPartPaths) {
        try {
          if (fs.existsSync(p)) fs.unlinkSync(p);
        } catch (_) {}
      }
    }
    throw error;
  } finally {
    if (sourceFd !== null) {
      try {
        fs.closeSync(sourceFd);
      } catch (_) {}
    }
  }
}

/**
 * Detect parts from a selected file
 * 
 * Supports:
 * - .001 (numeric scheme: .001, .002, ...)
 * - .part1 / .part01 (part scheme)
 * - Manifest file (.sha256)
 */
function detectSplitParts(selectedFilePath) {
  if (!fs.existsSync(selectedFilePath)) {
    throw new EngineError(`Selected file does not exist: "${selectedFilePath}"`, 'FILE_NOT_FOUND');
  }

  const dir = path.dirname(selectedFilePath);
  const selectedName = path.basename(selectedFilePath);

  let baseOriginalName = null;
  let namingType = null; // 'numeric' or 'part'

  // Test numeric scheme (.001, .002, etc.)
  const numericMatch = selectedName.match(/^(.*)\.(\d{3,})$/);
  // Test part scheme (.part1, .part01, etc.)
  const partMatch = selectedName.match(/^(.*)\.part(\d+)$/i);

  if (numericMatch) {
    baseOriginalName = numericMatch[1];
    namingType = 'numeric';
  } else if (partMatch) {
    baseOriginalName = partMatch[1];
    namingType = 'part';
  } else if (selectedName.endsWith('.sha256')) {
    // Read manifest to get base file name
    try {
      const content = fs.readFileSync(selectedFilePath, 'utf8');
      const origLine = content.split('\n').find(l => l.startsWith('# Original File:'));
      if (origLine) {
        baseOriginalName = origLine.replace('# Original File:', '').trim();
      }
    } catch (_) {}
    if (!baseOriginalName) {
      baseOriginalName = selectedName.replace(/\.sha256$/i, '');
    }
  } else {
    // If user selected the original name or any file, attempt to see if parts exist
    baseOriginalName = selectedName;
  }

  const allFilesInDir = fs.readdirSync(dir);
  const foundParts = [];

  // Match all files in directory that correspond to parts of baseOriginalName
  for (const f of allFilesInDir) {
    let partNum = null;

    // Check numeric pattern: baseOriginalName.001
    const nMatch = f.match(new RegExp(`^${escapeRegex(baseOriginalName)}\\.(\\d{3,})$`));
    if (nMatch) {
      partNum = parseInt(nMatch[1], 10);
    } else {
      // Check part pattern: baseOriginalName.part1
      const pMatch = f.match(new RegExp(`^${escapeRegex(baseOriginalName)}\\.part(\\d+)$`, 'i'));
      if (pMatch) {
        partNum = parseInt(pMatch[1], 10);
      }
    }

    if (partNum !== null) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      foundParts.push({
        partIndex: partNum,
        fileName: f,
        fullPath,
        size: stat.size
      });
    }
  }

  // Sort parts by index
  foundParts.sort((a, b) => a.partIndex - b.partIndex);

  // Check for manifest
  let manifestPath = path.join(dir, `${baseOriginalName}.sha256`);
  let expectedSha256 = null;
  if (fs.existsSync(manifestPath)) {
    try {
      const content = fs.readFileSync(manifestPath, 'utf8');
      const hashLine = content.split('\n').find(l => l.startsWith('# Original SHA-256:'));
      if (hashLine) {
        expectedSha256 = hashLine.replace('# Original SHA-256:', '').trim();
      } else {
        // Try standard format line "HEX *filename"
        const stdLine = content.split('\n').find(l => l.includes(`*${baseOriginalName}`));
        if (stdLine) {
          expectedSha256 = stdLine.split(/\s+/)[0].trim().toUpperCase();
        }
      }
    } catch (_) {}
  } else {
    manifestPath = null;
  }

  // Validate sequence integrity
  const missingParts = [];
  if (foundParts.length > 0) {
    const firstIndex = foundParts[0].partIndex;
    if (firstIndex !== 1) {
      for (let i = 1; i < firstIndex; i++) {
        missingParts.push(i);
      }
    }
    for (let i = 0; i < foundParts.length - 1; i++) {
      const current = foundParts[i].partIndex;
      const next = foundParts[i + 1].partIndex;
      if (next !== current + 1) {
        for (let m = current + 1; m < next; m++) {
          missingParts.push(m);
        }
      }
    }
  }

  const totalCalculatedSize = foundParts.reduce((acc, p) => acc + p.size, 0);

  return {
    baseOriginalName,
    outputDirectory: dir,
    parts: foundParts,
    totalParts: foundParts.length,
    missingParts,
    totalCalculatedSize,
    manifestPath,
    expectedSha256
  };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Core Join Engine
 * 
 * @param {Object} options
 * @param {string[]} options.partPaths Ordered list of part full paths
 * @param {string} options.outputPath Target rejoined file path
 * @param {string} [options.expectedSha256] Expected SHA-256 hash to verify against
 * @param {OperationController} [options.controller] Pause/cancel controller
 * @param {Function} [options.onProgress] Callback for progress updates
 * @param {Function} [options.onLog] Callback for status logs
 */
async function joinFiles(options) {
  const {
    partPaths,
    outputPath,
    expectedSha256 = null,
    controller = new OperationController(),
    onProgress = () => {},
    onLog = () => {}
  } = options;

  if (!partPaths || partPaths.length === 0) {
    throw new EngineError('No split parts provided to join.', 'NO_PARTS');
  }

  // 1. Verify all parts exist and can be read
  let totalRecombineSize = 0;
  for (const partPath of partPaths) {
    if (!fs.existsSync(partPath)) {
      throw new EngineError(`Missing part file: "${path.basename(partPath)}"`, 'PART_MISSING');
    }
    try {
      const stat = fs.statSync(partPath);
      totalRecombineSize += stat.size;
    } catch (err) {
      if (err.code === 'EBUSY' || err.code === 'EPERM') {
        throw new EngineError(`Part file is locked by another process: "${path.basename(partPath)}"`, 'FILE_LOCKED');
      }
      throw new EngineError(`Cannot read part file "${path.basename(partPath)}": ${err.message}`, err.code || 'READ_ERROR');
    }
  }

  // 2. Ensure target directory exists and check disk space
  const outputDir = path.dirname(outputPath);
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  } catch (err) {
    throw new EngineError(`Cannot create output directory: ${err.message}`, 'OUTPUT_DIR_ERROR');
  }

  const freeSpace = getFreeDiskSpace(outputDir);
  if (freeSpace !== null && freeSpace < totalRecombineSize + 1024 * 1024) {
    throw new EngineError(
      `Insufficient disk space to recombine file. Required: ${formatBytes(totalRecombineSize)}, Available: ${formatBytes(freeSpace)}.`,
      'DISK_SPACE_LOW'
    );
  }

  // 3. Open output file for writing
  let outputFd = null;
  try {
    outputFd = fs.openSync(outputPath, 'w');
  } catch (err) {
    if (err.code === 'EBUSY' || err.code === 'EPERM') {
      throw new EngineError(`Destination file is locked or access denied: "${path.basename(outputPath)}"`, 'FILE_LOCKED');
    }
    throw new EngineError(`Cannot create output file: ${err.message}`, err.code || 'WRITE_ERROR');
  }

  const BUFFER_SIZE = 4 * 1024 * 1024; // 4 MB chunk
  const buffer = Buffer.alloc(BUFFER_SIZE);
  const hash = crypto.createHash('sha256');

  let totalBytesProcessed = 0;
  const startTime = Date.now();
  let lastSpeedCheckTime = startTime;
  let lastSpeedBytes = 0;
  let currentSpeed = 0;

  onLog(`Starting recombine: ${partPaths.length} parts -> "${path.basename(outputPath)}" (${formatBytes(totalRecombineSize)})`);

  try {
    for (let i = 0; i < partPaths.length; i++) {
      await controller.checkWait();

      const partPath = partPaths[i];
      const partName = path.basename(partPath);
      onLog(`Merging part ${i + 1}/${partPaths.length}: ${partName}`);

      let partFd = null;
      try {
        partFd = fs.openSync(partPath, 'r');
      } catch (err) {
        throw new EngineError(`Failed to read part "${partName}": ${err.message}`, err.code || 'READ_ERROR');
      }

      try {
        let bytesRead = 0;
        let partOffset = 0;
        while ((bytesRead = fs.readSync(partFd, buffer, 0, BUFFER_SIZE, partOffset)) > 0) {
          await controller.checkWait();

          const chunk = buffer.subarray(0, bytesRead);
          fs.writeSync(outputFd, chunk, 0, bytesRead);
          hash.update(chunk);

          partOffset += bytesRead;
          totalBytesProcessed += bytesRead;

          // Speed and ETA calculations
          const now = Date.now();
          const elapsedSinceCheck = (now - lastSpeedCheckTime) / 1000;
          if (elapsedSinceCheck >= 0.5) {
            const bytesDelta = totalBytesProcessed - lastSpeedBytes;
            currentSpeed = bytesDelta / elapsedSinceCheck;
            lastSpeedCheckTime = now;
            lastSpeedBytes = totalBytesProcessed;
          }

          const remainingBytes = totalRecombineSize - totalBytesProcessed;
          const etaSeconds = currentSpeed > 0 ? Math.ceil(remainingBytes / currentSpeed) : 0;
          const progressPercent = Math.min(100, (totalBytesProcessed / totalRecombineSize) * 100);

          onProgress({
            currentPart: i + 1,
            totalParts: partPaths.length,
            processedBytes: totalBytesProcessed,
            totalBytes: totalRecombineSize,
            percent: progressPercent,
            speedBytesPerSec: currentSpeed,
            etaSeconds
          });
        }
      } finally {
        if (partFd !== null) {
          try { fs.closeSync(partFd); } catch (_) {}
        }
      }
    }

    fs.closeSync(outputFd);
    outputFd = null;

    const actualSha256 = hash.digest('hex').toUpperCase();
    onLog(`Recombination complete. Computed SHA-256: ${actualSha256}`);

    let hashVerified = null;
    if (expectedSha256) {
      const cleanExpected = expectedSha256.trim().toUpperCase();
      if (actualSha256 === cleanExpected) {
        hashVerified = true;
        onLog('Checksum verification SUCCESS: SHA-256 matches expected manifest!');
      } else {
        hashVerified = false;
        onLog(`Checksum verification FAILED! Expected: ${cleanExpected}, Actual: ${actualSha256}`);
      }
    }

    return {
      success: true,
      outputPath,
      totalSize: totalBytesProcessed,
      actualSha256,
      expectedSha256,
      hashVerified
    };
  } catch (error) {
    if (outputFd !== null) {
      try { fs.closeSync(outputFd); } catch (_) {}
    }
    if (error.code === 'CANCELLED') {
      onLog('Join cancelled. Removing partial reconstructed file...');
      try {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (_) {}
    }
    throw error;
  }
}

module.exports = {
  EngineError,
  OperationController,
  getFreeDiskSpace,
  formatBytes,
  computeFileChecksums,
  splitFile,
  detectSplitParts,
  joinFiles
};
