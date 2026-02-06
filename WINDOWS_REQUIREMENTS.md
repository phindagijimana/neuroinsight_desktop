# Windows Requirements & Compatibility

## TL;DR

✅ **Electron runs great on Windows** - No major compatibility issues!  
✅ **Works on Windows 10 & 11** - Full support  
⚠️ **Requires Docker Desktop** - Which needs WSL2  
✅ **We handle everything** - Automatic checks and guidance

---

## Windows Version Requirements

### Supported Windows Versions ✅

| Windows Version | Support | Notes |
|----------------|---------|-------|
| **Windows 11** | ✅ Full | Best experience |
| **Windows 10 (2004+)** | ✅ Full | Version 2004 or higher |
| **Windows 10 (older)** | ⚠️ Limited | May need WSL2 manual install |
| **Windows 8.1/7** | ❌ Not supported | Too old for Docker Desktop |

**Recommended:**
- Windows 10 version 2004 (May 2020 Update) or newer
- Windows 11 (any version)

### How to Check Windows Version

**User can check:**
```
Press Win + R
Type: winver
Press Enter
```

Should show:
- Windows 10: Version 2004 or higher (Build 19041+)
- Windows 11: Any version

---

## System Requirements

### Minimum Requirements

| Component | Requirement | Why |
|-----------|-------------|-----|
| **OS** | Windows 10 (2004+) or 11 | Electron + Docker Desktop |
| **CPU** | 64-bit processor | Required for Docker |
| **RAM** | 8GB | 4GB for system + 4GB for Docker |
| **Disk** | 50GB free | App + Docker images + data |
| **Virtualization** | Enabled in BIOS | Required for WSL2/Docker |

### Recommended Requirements

| Component | Recommended | Why |
|-----------|------------|-----|
| **RAM** | 16GB+ | Better for MRI processing |
| **CPU** | 4+ cores | Faster processing |
| **Disk** | 100GB SSD | Better I/O performance |

---

## Docker Desktop Requirements

### What Docker Desktop Needs

**Docker Desktop for Windows requires:**

1. **WSL2 (Windows Subsystem for Linux 2)**
   - Included in Windows 10 2004+
   - Docker Desktop installs it automatically
   - User doesn't need to do anything!

2. **Virtualization enabled**
   - Enabled in BIOS/UEFI
   - Usually enabled by default on modern PCs
   - If not: Restart → BIOS → Enable Intel VT-x or AMD-V

3. **Hyper-V (older method, not needed with WSL2)**
   - WSL2 is the modern approach
   - Hyper-V still works but slower

### Docker Desktop Installation Process

**Automatic for most users:**
```
User downloads Docker Desktop installer
         ↓
Runs installer
         ↓
Docker Desktop detects Windows version
         ↓
Automatically enables WSL2
         ↓
Downloads and installs Linux kernel
         ↓
Restarts computer (if needed)
         ↓
Done! Docker ready
```

**Our app detects and guides:**
```javascript
// docker-manager.js already handles this
const status = await checkDockerStatus();

if (!status.installed) {
  // Show: "Docker Desktop required"
  // Button: "Download Docker Desktop"
  // Opens: https://www.docker.com/products/docker-desktop/
}
```

---

## Compatibility Issues & Solutions

### Issue 1: Old Windows 10 Version

**Problem:**
```
Windows 10 version 1909 or older
→ WSL2 not available
→ Docker Desktop won't work properly
```

**Detection:**
```javascript
// system-check.js already handles this
if (osVersion < '2004') {
  results.warnings.push('Windows 10 version 2004+ required');
}
```

**Solution:**
```
Update Windows:
1. Settings → Update & Security
2. Check for Updates
3. Install Windows 10 version 2004 or newer
```

### Issue 2: Virtualization Disabled

**Problem:**
```
CPU virtualization disabled in BIOS
→ WSL2 can't run
→ Docker fails to start
```

**Symptoms:**
- Docker Desktop shows: "WSL2 installation incomplete"
- Or: "Hardware-assisted virtualization not available"

**Solution:**
```
1. Restart computer
2. Enter BIOS/UEFI (Press F2, F12, Del during boot)
3. Find "Virtualization Technology" or "Intel VT-x" or "AMD-V"
4. Enable it
5. Save and exit
6. Restart
```

**Our app checks:**
```javascript
// system-check.js
async function checkWindowsRequirements(results) {
  // Check WSL2
  const wsl2 = await checkWSL2();
  if (!wsl2.installed) {
    results.warnings.push('WSL2 not detected');
  }
}
```

### Issue 3: Antivirus Interference

**Problem:**
```
Some antivirus software blocks:
- Docker socket access
- WSL2 networking
- Container operations
```

**Common culprits:**
- Norton
- McAfee
- Kaspersky
- Corporate antivirus

**Solution:**
```
Add exceptions for:
- Docker Desktop
- WSL2
- NeuroInsight app
```

### Issue 4: Firewall Blocking

**Problem:**
```
Windows Firewall blocks:
- Docker API (port 2375)
- Backend (port 8000)
- MinIO (ports 9000, 9001)
```

**Solution:**
```
Windows Firewall automatically prompts:
"Allow Docker Desktop to access network?"
→ User clicks "Allow"
```

**Our app:**
- Uses localhost (usually not blocked)
- Automatically finds available ports
- Shows clear error if ports blocked

### Issue 5: Insufficient RAM

**Problem:**
```
< 8GB RAM
→ Docker + Windows + App = Slow
→ May crash during processing
```

**Detection:**
```javascript
// system-check.js
const memoryGB = os.totalmem() / (1024 ** 3);
if (memoryGB < 8) {
  results.warnings.push('Low memory: 8GB+ recommended');
}
```

**Solution:**
- Upgrade RAM (best)
- Close other apps during processing
- Process one scan at a time

### Issue 6: Disk Space

**Problem:**
```
< 50GB free space
→ FreeSurfer image: 7GB
→ MRI data: 1-5GB per scan
→ Temp files: 10-20GB
→ Not enough space!
```

**Detection:**
```javascript
// system-check.js
const freeSpace = await checkDiskSpace();
if (freeSpace < 50 * 1024**3) {
  results.warnings.push('Low disk space: 50GB+ recommended');
}
```

**Solution:**
- Free up space
- Use external drive
- Cloud storage

---

## What Our App Does Automatically

### System Checks on Startup ✅

```javascript
// main.js
async function initialize() {
  // Check system requirements
  const sysCheck = await checkSystemRequirements();
  
  if (sysCheck.status === 'error') {
    // Show error dialog with fixes
    dialog.showErrorBox('System Requirements', 
      'Your system does not meet requirements:\n' +
      sysCheck.errors.join('\n'));
  }
}
```

### Docker Detection ✅

```javascript
// docker-manager.js
async checkStatus() {
  try {
    await execAsync('docker --version');
    await execAsync('docker ps');
    return { installed: true, running: true };
  } catch (error) {
    return { installed: false, running: false };
  }
}
```

### User Guidance ✅

**If Docker not installed:**
```
┌─────────────────────────────────┐
│  Docker Required                │
├─────────────────────────────────┤
│  NeuroInsight requires Docker   │
│  Desktop for processing.        │
│                                 │
│  [Download Docker Desktop]      │
│  [Continue Anyway]  [Exit]      │
└─────────────────────────────────┘
```

**If Docker not running:**
```
┌─────────────────────────────────┐
│  Docker Not Running             │
├─────────────────────────────────┤
│  Please start Docker Desktop    │
│  and try again.                 │
│                                 │
│  [OK]                           │
└─────────────────────────────────┘
```

### Port Management ✅

```javascript
// backend-server.js
async start() {
  // Try port 8000
  if (await isPortAvailable(8000)) {
    this.port = 8000;
  } else {
    // Find alternative (8001-8050)
    this.port = await findAvailablePort(8000, 8050);
  }
}
```

---

## Windows-Specific Features

### Native Windows Integration ✅

**Start Menu:**
```
Windows Start Menu
└── NeuroInsight
    ├── NeuroInsight (launch)
    └── Uninstall NeuroInsight
```

**Desktop Shortcut:**
- Created during installation
- Navy blue icon
- Double-click to launch

**Taskbar:**
- App icon appears when running
- Right-click for quick actions
- Progress shown in icon (future feature)

**System Tray:**
```javascript
// main.js - Already implemented
function createTray() {
  tray = new Tray(iconPath);
  tray.setContextMenu([
    { label: 'Show NeuroInsight', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
}
```

**File Associations:**
```json
// package.json - Can be configured
"build": {
  "fileAssociations": [
    {
      "ext": "nii",
      "name": "NIfTI MRI Image",
      "role": "Viewer"
    },
    {
      "ext": "nii.gz",
      "name": "Compressed NIfTI",
      "role": "Viewer"
    }
  ]
}
```

### Windows Paths ✅

**Handled automatically:**
```javascript
// Uses path.join() everywhere
const userDataPath = app.getPath('userData');
// Windows: C:\Users\Name\AppData\Roaming\neuroinsight-desktop
// Linux: /home/name/.config/neuroinsight-desktop
// macOS: /Users/name/Library/Application Support/neuroinsight-desktop

// All work correctly!
```

---

## Installation Process on Windows

### What User Does

1. **Download installer:**
   ```
   NeuroInsight-Setup-1.0.0.exe (200MB)
   ```

2. **Run installer:**
   - Double-click .exe
   - Windows SmartScreen may show (click "More info" → "Run anyway")
   - Click "Next, Next, Install"

3. **Choose install location:**
   ```
   Default: C:\Program Files\NeuroInsight
   Or: User chooses different location
   ```

4. **Installation completes:**
   - Desktop shortcut created
   - Start Menu entry added
   - App launches automatically

5. **First launch:**
   - App checks for Docker
   - If not found: Shows download link
   - User installs Docker Desktop
   - Restarts NeuroInsight
   - Ready!

### What Gets Installed

```
C:\Program Files\NeuroInsight\
├── NeuroInsight.exe (main executable)
├── resources\
│   ├── app.asar (packed application)
│   └── electron.asar (Electron framework)
├── locales\ (language files)
├── ffmpeg.dll
├── libEGL.dll
├── libGLESv2.dll
└── ... (Electron runtime files)

C:\Users\Name\AppData\Roaming\neuroinsight-desktop\
├── config.json (user settings)
├── logs\ (application logs)
└── ...

Docker:
C:\ProgramData\Docker\
└── (Docker Desktop installation)
```

---

## Performance on Windows

### Expected Performance

**App Startup:**
- Cold start: 2-5 seconds
- Warm start: 1-2 seconds

**Docker Operations:**
- Container start: 10-30 seconds
- Image pull (first time): 10-30 minutes
- Processing: 3-7 hours (FreeSurfer, same as Linux)

**Resource Usage:**
```
NeuroInsight App:
- RAM: 100-300MB
- CPU: <5% idle, 10-20% active

Docker Desktop:
- RAM: 2-4GB
- CPU: Variable (depends on processing)

FreeSurfer Processing:
- RAM: 2-8GB
- CPU: 100% of allocated cores
```

### Optimization

**Already implemented:**
```javascript
// Backend finds available resources
const cpuCount = os.cpus().length;
const totalMemory = os.totalmem();

// Allocate appropriately to Docker
```

---

## Common User Questions

### "Will this slow down my computer?"

**Answer:**
- NeuroInsight app: Very light (<300MB RAM)
- Docker Desktop: 2-4GB RAM when idle
- During processing: High CPU/RAM usage (expected)
- When not processing: Minimal impact

### "Do I need administrator rights?"

**For installation:** Yes (to install in Program Files)
**For running:** No (runs as normal user)
**For Docker:** First-time setup needs admin, then normal user

### "Can I use it offline?"

**After initial setup:** Yes!
- FreeSurfer image cached locally
- No internet needed for processing
- Internet only needed for:
  - Installing Docker Desktop
  - Downloading FreeSurfer image (first time)
  - App updates (optional)

### "Will it work on my laptop?"

**If laptop meets requirements:**
- Windows 10 2004+ or 11
- 8GB+ RAM (16GB recommended)
- 50GB+ free space
- 64-bit processor
- Then: Yes! ✅

### "What about Windows in S mode?"

**No, sorry:**
- Windows S mode only allows Microsoft Store apps
- Docker Desktop not available in Store
- User must exit S mode (free, one-way)

---

## Security Considerations

### Windows Defender

**Usually no issues:**
- NeuroInsight is legitimate app
- May show "Unknown publisher" warning (until we code-sign)
- User can proceed safely

**If blocked:**
```
Windows Defender → Virus & threat protection
→ Allowed threats
→ Add NeuroInsight as exception
```

### SmartScreen

**First install may show:**
```
"Windows protected your PC"
→ Click "More info"
→ Click "Run anyway"
```

**After code signing (future):**
- No warnings
- Shows: "Verified publisher"

### Firewall

**Usually works automatically:**
- App uses localhost (not blocked)
- Docker Desktop prompts for network access
- User clicks "Allow"

---

## Troubleshooting Guide for Users

### Quick Fixes

**App won't start:**
1. Restart computer
2. Check Windows version (Win+R → winver)
3. Check antivirus isn't blocking

**Docker not detected:**
1. Install Docker Desktop
2. Start Docker Desktop
3. Wait for whale icon to be steady (not animating)
4. Restart NeuroInsight

**Port conflict:**
1. App finds alternative port automatically
2. Check: "Backend: Running on port 8001" (or other)
3. No action needed

**Slow performance:**
1. Close other apps
2. Check Task Manager (Ctrl+Shift+Esc)
3. Ensure 8GB+ RAM available
4. Consider upgrading RAM

---

## Summary: Windows Compatibility

### ✅ Excellent Compatibility

**What works great:**
- Windows 10 (2004+) and 11
- Electron framework (mature on Windows)
- Docker Desktop (well-supported)
- All app features
- Native Windows integration

### ⚠️ Requirements

**User needs:**
- Modern Windows 10 or 11
- 8GB+ RAM
- 50GB+ disk space
- Docker Desktop (we guide them)

### ✅ We Handle Everything

**App automatically:**
- Checks system requirements
- Detects Docker
- Guides installation
- Finds available ports
- Shows clear errors
- Provides solutions

### 🎯 Bottom Line

**NeuroInsight will work great on Windows!**

No major compatibility issues. Just needs:
- Reasonable modern PC
- Windows 10 2004+ or Windows 11
- Docker Desktop (we help them install)

**Standard Electron + Docker setup = Proven technology ✅**
