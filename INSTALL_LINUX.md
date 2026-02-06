# Linux Installation Guide

## ✅ One-Command Install (Automated!)

### Quick Install Script

We've created an installer that handles everything automatically:

```bash
# Download the installer
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/install.sh

# Run it (automatically does chmod and everything!)
bash install.sh
```

**What it does:**
1. ✅ Automatically makes AppImage executable (no chmod needed!)
2. ✅ Installs to system menu
3. ✅ Creates desktop shortcut
4. ✅ Adds icon
5. ✅ Done!

**User never has to run chmod manually!**

---

## Installation Methods

### Method 1: One-Line Install (Easiest) ✅

```bash
curl -fsSL https://raw.githubusercontent.com/phindagijimana/neuroinsight_desktop/main/install.sh | bash
```

**What happens:**
- Downloads installer script
- Downloads AppImage
- Makes it executable automatically
- Adds to system menu
- Ready to use!

### Method 2: Manual Download (Traditional)

**Download:**
```bash
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.AppImage
```

**Run installer script:**
```bash
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/install.sh
bash install.sh
# Automatically handles chmod!
```

### Method 3: Quick Run (No Installation)

**If user just wants to try it:**
```bash
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.AppImage
chmod +x NeuroInsight-1.0.0.AppImage
./NeuroInsight-1.0.0.AppImage
```

### Method 4: GUI (No Terminal Needed!)

**Most Linux file managers can do this:**

1. Download AppImage from GitHub
2. Right-click the file
3. Select "Properties" or "Permissions"
4. Check "Allow executing file as program"
5. Double-click to run

**Or even easier (some file managers):**
1. Download AppImage
2. Right-click
3. "Run" or "Execute" (automatically makes executable)

---

## Why chmod is Required (Security)

### Linux Security Model

**By default:**
- Downloaded files are NOT executable
- This prevents accidental malware execution
- User must explicitly make files executable

**chmod +x means:**
- "Change mode to executable"
- Required for security
- One-time operation

### Our Solutions

**Option 1: Install script (recommended)**
```bash
bash install.sh  # Handles chmod automatically!
```

**Option 2: File manager**
```
Right-click → Properties → Make executable → Run
```

**Option 3: One-liner**
```bash
chmod +x NeuroInsight-1.0.0.AppImage && ./NeuroInsight-1.0.0.AppImage
```

---

## Updated User Instructions

### For GitHub README

**Before (required 2 commands):**
```bash
chmod +x NeuroInsight-1.0.0.AppImage
./NeuroInsight-1.0.0.AppImage
```

**After (single command):**
```bash
bash install.sh
```

**Or even simpler:**
```bash
curl -fsSL https://raw.githubusercontent.com/phindagijimana/neuroinsight_desktop/main/install.sh | bash
```

---

## Alternative: .deb Package (No chmod Needed)

### Debian Package

Users who prefer traditional installation:

```bash
# Single command install
sudo dpkg -i NeuroInsight-1.0.0.deb

# Run
neuroinsight  # No chmod, no ./ needed!
```

**Advantages:**
- ✅ No chmod needed
- ✅ Installs system-wide automatically
- ✅ Shows in menu automatically
- ✅ Familiar for Debian/Ubuntu users

---

## Comparison

| Method | Commands | chmod Needed? | Installation |
|--------|----------|---------------|--------------|
| **Install script** | 1 | ❌ Automated | Yes (menu) |
| **AppImage + GUI** | 0 | ❌ GUI handles | No |
| **AppImage manual** | 2 | ✅ Yes | No |
| **.deb package** | 1 | ❌ No | Yes (system) |

---

## User Documentation

### Simple Version (For Users)

**Option 1: Quick Install (Recommended)**
```bash
bash <(wget -qO- https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/install.sh)
```

**Option 2: GUI (No Terminal)**
1. Download AppImage
2. Right-click → "Make executable and run"
3. Done!

**Option 3: Debian Package**
```bash
sudo dpkg -i NeuroInsight-1.0.0.deb
```

**No need to explain chmod!**

---

## Next Steps

1. ✅ Icons updated (NeuroInsight as one word)
2. ✅ Install script created (automates chmod)
3. Rebuild packages with new icons
4. Add install.sh to GitHub Release

Should I:
- **A) Rebuild the Linux packages with new icon?**
- **B) Commit and push the changes first?**
- **C) Both?**
