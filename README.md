<div align="center">

# ⚡ PartX — File Splitter & Joiner

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6?logo=windows)](https://microsoft.com)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?logo=node.js)](https://nodejs.org)
[![Electron](https://img.shields.io/badge/Electron-v33-47848F?logo=electron)](https://electronjs.org)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**A high-performance, open-source File Splitter & Joiner desktop application for Windows, featuring modern Fluent Design (Mica/Acrylic aesthetic), cryptographic SHA-256 verification, and asynchronous non-blocking stream I/O.**

[Features](#-key-features) • [Screenshots](#-screenshots) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Usage](#-usage-guide) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 🌟 Key Features

### ✂️ 1. Flexible File Splitting
- **Drag-and-Drop / File Picker**: Pick any source file of any size (multi-gigabyte ISOs, video files, VM images, raw datasets).
- **Two Splitting Modes**:
  - **By Chunk Size**: Split into fixed increments (KB, MB, GB, e.g., 100 MB, 500 MB, 1 GB).
  - **By Number of Parts**: Evenly divide files into \(N\) parts.
- **Configurable Sequential Naming**:
  - Numeric format (`.001`, `.002`, `.003`, etc. — 7-Zip / Total Commander compatible).
  - Part format (`.part1`, `.part2`, `.part3`, etc.).
- **Automatic Checksum Manifest Generation**: Generates standard `.sha256` manifest files with per-part and complete original file hashes for fail-safe validation.

### 🧩 2. Automated File Joining & Recombination
- **Smart Sequence Detection**: Pick any `.001` or `.part1` file; PartX automatically indexes the entire directory and orders all parts.
- **Sequence Gap Detection**: Proactively detects missing parts (e.g. part 3 missing between 2 and 4) and alerts you before recombining to prevent corrupt output.
- **Automatic Cryptographic Verification**: Computes the rejoined file's SHA-256 digest on-the-fly and compares it with the manifest checksum.

### 🎨 3. Modern Windows Fluent Design UI
- **Windows 11 Fluent Theme**: Mica-inspired translucent layers, smooth animations, and high-DPI scaling.
- **Light & Dark Mode**: One-click theme toggle with persistent styles.
- **Real-Time Telemetry**:
  - Live progress bar (%)
  - Real-time I/O throughput in MB/s
  - Estimated time remaining (ETA)
  - Active part counter and live activity console log
- **Interactive Control**: Pause, Resume, and Cancel operations at any moment without freezing the application.

### 🛡️ 4. Enterprise-Grade Resilience
- **Non-blocking Asynchronous I/O**: Electron main thread runs streamed chunk pipelines with 4 MB read/write buffers.
- **Defensive Pre-flight Checks**:
  - Pre-verifies available disk space on the target drive before executing writes.
  - Comprehensive handling for locked files (`EBUSY`, `EPERM`).
  - Graceful cleanup of partial files upon cancellation.

---

## 📸 Screenshots

| Dark Theme (Fluent Design) | Light Theme |
|:---:|:---:|
| ![PartX Dark Theme](https://placehold.co/600x400/0b0f19/38bdf8?text=PartX+Dark+Fluent+UI) | ![PartX Light Theme](https://placehold.co/600x400/f1f5f9/0284c7?text=PartX+Light+Fluent+UI) |

---

## 🏛️ Architecture & Project Structure

PartX is built with safety, memory efficiency, and native Windows performance in mind:

```
File Splitter/
├── src/
│   ├── engine/
│   │   └── engine.js          # High-throughput streaming split & join engine
│   ├── main/
│   │   ├── main.js            # Electron lifecycle, native dialogs, and IPC handlers
│   │   └── preload.js         # Context-isolated secure bridge
│   └── renderer/
│       ├── index.html         # Modern Fluent Design UI structure
│       ├── style.css          # Dark/Light CSS styling with backdrop filters
│       └── renderer.js        # UI state management and progress telemetry
├── tests/
│   └── engine.test.js         # Integration and unit test suite
├── .gitignore                 # Optimized repository exclusions
├── LICENSE                    # MIT License
├── package.json               # Scripts, configuration, and dependencies
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Windows 10 or 11
- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- npm (v9.0.0 or later)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/partx-file-splitter.git
   cd partx-file-splitter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the automated test suite**:
   ```bash
   npm test
   ```

4. **Launch the application in development**:
   ```bash
   npm start
   ```

---

## 📦 Packaging and Distribution

To build standalone Windows installers (`.exe`) and portable executables:

```bash
npm run build:win
```

The compiled binaries will be output to the `dist/` folder:
- **Installer**: `dist/PartX File Splitter & Joiner Setup 1.0.0.exe`
- **Portable**: `dist/PartX File Splitter & Joiner 1.0.0.exe`

---

## 📖 Usage Guide

### Splitting a File
1. Launch PartX and stay on the **Split File** tab.
2. Drag and drop your large target file into the dropzone (or click to browse).
3. Choose your split configuration:
   - **By Chunk Size**: Specify the size (e.g. `250 MB`, `1 GB`).
   - **By Number of Parts**: Specify how many files to generate.
4. Select your preferred naming scheme (`.001` or `.part1`).
5. Choose an output destination folder (defaults to the file's current directory).
6. Click **Start Splitting**. You can pause, resume, or cancel at any time.

### Joining Split Files
1. Switch to the **Join / Recombine Files** tab.
2. Drag and drop either the first split part (`.001` / `.part1`) or the generated `.sha256` manifest.
3. PartX will automatically scan the folder and list all discovered parts in sequential order.
4. If a `.sha256` manifest is present, the expected hash is automatically populated.
5. Select the target file save path and click **Start Joining**.
6. Once recombined, PartX automatically checks the reconstructed file against the hash to guarantee 100% data fidelity.

---

## 🤝 Contributing

Contributions are welcomed and encouraged!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`).
4. Run tests to ensure high quality (`npm test`).
5. Push to the Branch (`git push origin feature/AmazingFeature`).
6. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
