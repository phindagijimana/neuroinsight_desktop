# Installation Guide

## Linux Installation

### Method 1: AppImage (Universal)

Works on any Linux distribution without installation.

```bash
# Download
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/latest/download/NeuroInsight-1.0.0.AppImage

# Make executable and run
chmod +x NeuroInsight-1.0.0.AppImage
./NeuroInsight-1.0.0.AppImage
```

**Advantages:**
- No installation needed
- Runs from any folder
- Works on all Linux distros
- No root/sudo required
- Easy to remove (just delete file)

### Method 2: Debian Package (Ubuntu/Debian/Mint)

System-wide installation for Debian-based distributions.

```bash
# Download
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/latest/download/NeuroInsight-1.0.0.deb

# Install
sudo dpkg -i NeuroInsight-1.0.0.deb

# Run from terminal
neuroinsight

# Or launch from application menu
```

**Advantages:**
- Installs to /opt/NeuroInsight
- Adds to application menu
- Creates command: `neuroinsight`
- Easy uninstall: `sudo apt remove neuroinsight`

### Optional: Add AppImage to System Menu

```bash
# Create local bin directory
mkdir -p ~/.local/bin

# Copy AppImage
cp NeuroInsight-1.0.0.AppImage ~/.local/bin/NeuroInsight.AppImage

# Create desktop entry
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/neuroinsight.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=NeuroInsight
Comment=MRI Brain Analysis
Exec=$HOME/.local/bin/NeuroInsight.AppImage
Icon=neuroinsight
Terminal=false
Categories=Science;MedicalSoftware;
EOF

# Update desktop database
update-desktop-database ~/.local/share/applications 2>/dev/null || true
```

## Windows Installation

### Standard Installation

1. Download `NeuroInsight-Setup-1.0.0.exe` from GitHub releases
2. Double-click the installer
3. Follow the installation wizard
   - Accept license agreement
   - Choose installation location (default: C:\Program Files\NeuroInsight)
   - Select Start Menu folder
   - Choose desktop shortcut option
4. Click Install and wait for completion
5. Launch NeuroInsight from:
   - Desktop shortcut
   - Start Menu > NeuroInsight
   - Search "NeuroInsight" in Windows search

### Portable Version (No Installation)

1. Download `NeuroInsight-1.0.0-win-portable.zip`
2. Extract to any folder
3. Run `NeuroInsight.exe` from extracted folder
4. No installation or admin rights required

**Advantages:**
- Run from USB drive
- No system changes
- Easy to move or remove

## macOS Installation

### Standard Installation

1. Download `NeuroInsight-1.0.0.dmg` from GitHub releases
2. Open the DMG file
3. Drag NeuroInsight icon to Applications folder
4. Eject the DMG
5. Launch from Applications or Spotlight

### First Launch (Security)

macOS may show "unidentified developer" warning on first launch:

1. Open System Preferences > Security & Privacy
2. Click "Open Anyway" for NeuroInsight
3. Or right-click app > Open > confirm

## Post-Installation Setup

### 1. Install Docker Desktop

Required for all platforms.

**Windows/macOS:**
- Download: https://www.docker.com/products/docker-desktop/
- Run installer
- Follow setup wizard
- Restart if prompted

**Linux:**
```bash
# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in
```

### 2. Get FreeSurfer License

Required for MRI processing (free for research).

1. Visit: https://surfer.nmr.mgh.harvard.edu/registration.html
2. Complete registration form
3. Save license file as `license.txt`
4. Place in home directory or NeuroInsight will prompt on first run

### 3. First Run

1. Start Docker Desktop (Windows/Mac) or ensure Docker is running (Linux)
2. Launch NeuroInsight
3. App performs system checks:
   - Docker installation
   - Docker status
   - Available resources
4. First job triggers FreeSurfer image download (~7GB, one-time)
5. Processing begins automatically

## System Requirements

### Minimum
- OS: Windows 10 (2004+), Linux (any modern distro), macOS 10.13+
- RAM: 8GB
- Disk: 50GB free
- CPU: 4 cores
- Docker: Latest version

### Recommended
- RAM: 16GB or more
- Disk: 100GB free (SSD preferred)
- CPU: 8 cores
- Internet: Fast connection for initial setup

## Verification

### Test Installation

1. Launch NeuroInsight
2. Check Docker status indicator (top right)
3. Navigate to Settings tab
4. Verify system information displays correctly

### Test Docker Integration

```bash
# Verify Docker is running
docker ps

# Check NeuroInsight containers (after first job)
docker ps -a | grep neuroinsight

# Check FreeSurfer image (after first download)
docker images | grep freesurfer
```

## Uninstallation

### Linux (AppImage)
```bash
# Simply delete the file
rm NeuroInsight-1.0.0.AppImage

# If added to menu
rm ~/.local/bin/NeuroInsight.AppImage
rm ~/.local/share/applications/neuroinsight.desktop
```

### Linux (DEB)
```bash
sudo apt remove neuroinsight
```

### Windows
1. Settings > Apps > NeuroInsight > Uninstall
2. Or use Control Panel > Programs and Features

### macOS
1. Open Applications folder
2. Drag NeuroInsight to Trash
3. Empty Trash

### Remove Data

Application data is stored in:
- **Linux**: `~/.config/neuroinsight`
- **Windows**: `%APPDATA%\neuroinsight`
- **macOS**: `~/Library/Application Support/neuroinsight`

Docker volumes persist after uninstall. To remove:
```bash
docker volume ls | grep neuroinsight
docker volume rm <volume-name>
```

## Troubleshooting

### Linux: "Permission denied"
```bash
chmod +x NeuroInsight-1.0.0.AppImage
```

### Linux: Docker permission denied
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### Windows: "Windows protected your PC"
- Click "More info"
- Click "Run anyway"
- This is normal for unsigned applications

### macOS: "Cannot open because developer cannot be verified"
- System Preferences > Security & Privacy
- Click "Open Anyway"

### All Platforms: Docker not found
- Install Docker Desktop
- Ensure Docker is running
- Restart NeuroInsight

---

For more help, see README.md or visit:
https://github.com/phindagijimana/neuroinsight_desktop/issues

---

© 2025 University of Rochester. All rights reserved.
