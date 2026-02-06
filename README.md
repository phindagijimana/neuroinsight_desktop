# NeuroInsight Desktop

Cross-platform desktop application for automated MRI brain analysis using FreeSurfer.

## Features

- Cross-platform: Works on Windows, Linux, and macOS
- Docker Integration: Uses Docker containers for FreeSurfer processing
- Native Desktop Experience: Standalone application with system integration
- User-Friendly Interface: Modern, intuitive UI for MRI analysis
- Offline Capable: Works without constant internet connection

## System Requirements

### All Platforms
- 16GB+ RAM (32GB recommended)
- 50GB+ free disk space
- Docker Desktop or Docker Engine
- Internet connection (for first-time FreeSurfer image download)

### Platform-Specific
- **Windows**: Windows 10 (version 2004+) or Windows 11
- **Linux**: Any modern distribution (Ubuntu, Debian, Fedora, etc.)
- **macOS**: macOS 10.13+ (High Sierra or later)

## Download

### Direct Downloads - v1.0.0

**Linux:**
- [NeuroInsight-1.0.0.AppImage](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.AppImage) (100 MB) - Universal, works on any distro
- [NeuroInsight-1.0.0.deb](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.deb) (69 MB) - Ubuntu/Debian/Mint

**Windows:**
- [NeuroInsight-Setup-1.0.0.exe](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-Setup-1.0.0.exe) (73 MB) - Installer with shortcuts
- [NeuroInsight-Portable-1.0.0.exe](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-Portable-1.0.0.exe) (73 MB) - Portable version

**All Releases:** [GitHub Releases](https://github.com/phindagijimana/neuroinsight_desktop/releases)

---

## Installation

### Linux

**AppImage (Recommended - Works on any distro):**
```bash
# Download
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.AppImage

# Make executable and run
chmod +x NeuroInsight-1.0.0.AppImage
./NeuroInsight-1.0.0.AppImage
```

**Debian Package (Ubuntu/Debian/Mint):**
```bash
# Download
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.deb

# Install
sudo dpkg -i NeuroInsight-1.0.0.deb

# Run
neuroinsight
```

### Windows

1. Download [NeuroInsight-Setup-1.0.0.exe](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-Setup-1.0.0.exe)
2. Run the installer
3. Follow installation wizard
4. Launch from Start Menu or Desktop shortcut

### macOS

**Note:** macOS support is planned for v2.0.0. For now, use the [Docker deployment](https://github.com/phindagijimana/neuroinsight_local).

## Quick Start

1. **Install Docker Desktop**
   - Windows/Mac: https://www.docker.com/products/docker-desktop/
   - Linux: Use package manager or Docker Engine

2. **Start Docker**
   - Ensure Docker is running before launching NeuroInsight
   - Check Docker Desktop icon or run `docker ps`

3. **Launch NeuroInsight**
   - The app will check Docker status on startup
   - First run downloads FreeSurfer image (~7GB, 10-30 minutes)

4. **Process MRI Scans**
   - Upload T1-weighted NIfTI files (.nii or .nii.gz)
   - Monitor processing progress (3-7 hours per scan)
   - View results with interactive visualization

## Troubleshooting

### Docker Not Found
- Ensure Docker Desktop is installed and running
- Windows: Check that WSL2 is enabled
- Linux: Verify user is in docker group: `sudo usermod -aG docker $USER`

### Port Already in Use
- Default port is 8000
- App automatically finds available port (8000-8050)
- Check Docker containers: `docker ps`

### FreeSurfer Image Download Slow
- Image is ~7GB and requires good internet connection
- Download happens once and is cached
- Progress shown in app logs

### Processing Fails
- Verify sufficient RAM (16GB minimum)
- Check Docker has enough resources allocated
- Ensure T1-weighted MRI file format is correct (.nii or .nii.gz)

## Support

- **GitHub Issues**: https://github.com/phindagijimana/neuroinsight_desktop/issues
- **Main Repository**: https://github.com/phindagijimana/neuroinsight_local
- **FreeSurfer Support**: https://surfer.nmr.mgh.harvard.edu/fswiki/FreeSurferSupport

## License

MIT License. FreeSurfer requires separate license for research use.

Get FreeSurfer license (free for research):
https://surfer.nmr.mgh.harvard.edu/registration.html

---

© 2025 University of Rochester. All rights reserved.
