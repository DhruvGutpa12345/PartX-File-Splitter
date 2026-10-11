const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const {
  splitFile,
  detectSplitParts,
  joinFiles,
  computeSha256,
  OperationController
} = require('../src/engine/engine');

async function runTests() {
  console.log('🧪 Starting PartX Engine Unit and Integration Tests...\n');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'partx-test-'));

  try {
    // 1. Create a dummy test file with pseudo-random content
    const testFileSize = 15 * 1024 * 1024; // 15 MB
    const testFilePath = path.join(tempDir, 'sample_dataset.bin');
    console.log(`Creating dummy file (${testFileSize / 1024 / 1024} MB)...`);
    const buffer = crypto.randomBytes(testFileSize);
    fs.writeFileSync(testFilePath, buffer);

    const originalHash = crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
    console.log(`Original SHA-256: ${originalHash}`);

    // --- TEST 1: Split by size (4 MB chunks => 4 parts) ---
    console.log('\n--- Test 1: Split by Chunk Size (4 MB) ---');
    const splitDir = path.join(tempDir, 'split_size_out');
    const splitResult = await splitFile({
      sourcePath: testFilePath,
      outputDir: splitDir,
      splitMode: 'size',
      chunkSizeBytes: 4 * 1024 * 1024,
      namingPattern: 'numeric',
      createManifest: true,
      onLog: (msg) => console.log('  [LOG]', msg)
    });

    assert.strictEqual(splitResult.success, true);
    assert.strictEqual(splitResult.totalParts, 4);
    assert.strictEqual(splitResult.sha256, originalHash);
    assert(fs.existsSync(splitResult.manifestPath), 'Manifest file must exist');
    console.log('✅ Test 1 Passed: Split by size succeeded with correct parts and manifest.');

    // --- TEST 2: Detection of parts ---
    console.log('\n--- Test 2: Auto-detect Split Parts ---');
    const firstPart = path.join(splitDir, 'sample_dataset.bin.001');
    const detected = detectSplitParts(firstPart);
    assert.strictEqual(detected.baseOriginalName, 'sample_dataset.bin');
    assert.strictEqual(detected.totalParts, 4);
    assert.strictEqual(detected.missingParts.length, 0);
    assert.strictEqual(detected.expectedSha256, originalHash);
    console.log('✅ Test 2 Passed: Detected all 4 parts, manifest, and expected SHA-256.');

    // --- TEST 3: Joining files & Integrity verification ---
    console.log('\n--- Test 3: Join Files and Verify SHA-256 ---');
    const recombinedPath = path.join(tempDir, 'recombined_dataset.bin');
    const joinResult = await joinFiles({
      partPaths: detected.parts.map(p => p.fullPath),
      outputPath: recombinedPath,
      expectedSha256: detected.expectedSha256,
      onLog: (msg) => console.log('  [LOG]', msg)
    });

    assert.strictEqual(joinResult.success, true);
    assert.strictEqual(joinResult.totalSize, testFileSize);
    assert.strictEqual(joinResult.actualSha256, originalHash);
    assert.strictEqual(joinResult.hashVerified, true);
    console.log('✅ Test 3 Passed: Recombined file matches original SHA-256 perfectly.');

    // --- TEST 4: Split by part count (3 equal parts) with .part1 scheme ---
    console.log('\n--- Test 4: Split by Part Count (3 parts) with .partN scheme ---');
    const splitDirCount = path.join(tempDir, 'split_count_out');
    const splitCountResult = await splitFile({
      sourcePath: testFilePath,
      outputDir: splitDirCount,
      splitMode: 'count',
      partsCount: 3,
      namingPattern: 'part',
      createManifest: true
    });

    assert.strictEqual(splitCountResult.totalParts, 3);
    const detectedPartScheme = detectSplitParts(path.join(splitDirCount, 'sample_dataset.bin.part1'));
    assert.strictEqual(detectedPartScheme.totalParts, 3);
    assert.strictEqual(detectedPartScheme.missingParts.length, 0);

    const recombinedCountPath = path.join(tempDir, 'recombined_count.bin');
    const joinCountResult = await joinFiles({
      partPaths: detectedPartScheme.parts.map(p => p.fullPath),
      outputPath: recombinedCountPath,
      expectedSha256: detectedPartScheme.expectedSha256
    });

    assert.strictEqual(joinCountResult.hashVerified, true);
    console.log('✅ Test 4 Passed: Split by count with .partN naming pattern succeeded and verified.');

    // --- TEST 5: Missing part detection ---
    console.log('\n--- Test 5: Missing Part Detection ---');
    fs.unlinkSync(path.join(splitDirCount, 'sample_dataset.bin.part2'));
    const detectedMissing = detectSplitParts(path.join(splitDirCount, 'sample_dataset.bin.part1'));
    assert.deepStrictEqual(detectedMissing.missingParts, [2]);
    console.log('✅ Test 5 Passed: Accurately identified missing part 2.');

    // --- TEST 6: Pause and Cancel Controller ---
    console.log('\n--- Test 6: Operation Controller (Cancel) ---');
    const cancelController = new OperationController();
    const cancelPromise = splitFile({
      sourcePath: testFilePath,
      outputDir: path.join(tempDir, 'split_cancel'),
      splitMode: 'count',
      partsCount: 5,
      controller: cancelController,
      onProgress: (p) => {
        if (p.currentPart >= 2) {
          cancelController.cancel();
        }
      }
    });

    let caughtError = null;
    try {
      await cancelPromise;
    } catch (e) {
      caughtError = e;
    }
    assert(caughtError !== null, 'Cancellation should throw EngineError');
    assert.strictEqual(caughtError.code, 'CANCELLED');
    console.log('✅ Test 6 Passed: Operation cancellation cleanly handled.');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The core engine is rock-solid.\n');
  } finally {
    // Clean up temporary test files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

runTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
