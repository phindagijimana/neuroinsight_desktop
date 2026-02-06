# NeuroInsight Desktop v1.0.0

**Release Date:** February 6, 2026

## Overview

First official release of NeuroInsight Desktop - a cross-platform native application for automated MRI brain analysis using FreeSurfer.

## What's New

### Desktop Application
- **Native Applications**: One-click installers for Windows and Linux
- **Modern UI**: Intuitive interface for MRI analysis workflows
- **Docker Integration**: Seamless FreeSurfer processing via Docker containers
- **Real-time Progress**: Live monitoring of processing jobs with detailed status
- **Data Persistence**: Local storage with automatic MinIO backup
- **System Integration**: System tray support, desktop shortcuts, native notifications

### Platform Support
- **Windows 10/11**: Full support with WSL2/Docker Desktop
- **Linux**: Universal AppImage + DEB packages for Ubuntu/Debian
- **macOS**: Planned for v2.0.0 (Docker deployment available now)

## Downloads

### Windows (73 MB each)
- [NeuroInsight-Setup-1.0.0.exe](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-Setup-1.0.0.exe) - Installer with shortcuts
- [NeuroInsight-Portable-1.0.0.exe](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-Portable-1.0.0.exe) - Portable version (no install)

### Linux
- [NeuroInsight-1.0.0.AppImage](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.AppImage) (100 MB) - Universal, works on any distro
- [NeuroInsight-1.0.0.deb](https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.deb) (69 MB) - Ubuntu/Debian/Mint

## System Requirements

### Minimum
- **RAM:** 16GB (32GB recommended)
- **Disk Space:** 50GB+ free
- **Docker:** Docker Desktop or Docker Engine
- **OS:** Windows 10 (2004+), Windows 11, or any modern Linux distribution

### Platform-Specific
- **Windows:** WSL2 enabled, Docker Desktop installed
- **Linux:** User in docker group (`sudo usermod -aG docker $USER`)

## Quick Start

### Installation

**Windows:**
1. Download `NeuroInsight-Setup-1.0.0.exe`
2. Run installer and follow wizard
3. Launch from Start Menu

**Linux (AppImage):**
```bash
chmod +x NeuroInsight-1.0.0.AppImage
./NeuroInsight-1.0.0.AppImage
```

**Linux (DEB):**
```bash
sudo dpkg -i NeuroInsight-1.0.0.deb
neuroinsight
```

### First Run
1. Install Docker Desktop (if not already installed)
2. Start Docker Desktop
3. Launch NeuroInsight
4. First run downloads FreeSurfer image (~7GB, one-time)
5. Upload T1-weighted MRI file (.nii or .nii.gz)
6. Processing starts automatically (~7 hours)

## Features

### MRI Processing
- Automatic hippocampal segmentation using FreeSurfer
- T1-weighted NIfTI file support (.nii, .nii.gz)
- Single and batch processing
- 7-hour average processing time per scan
- Automatic quality checks

### User Interface
- File upload via drag-and-drop or browse
- Real-time progress monitoring
- Processing log viewer
- Results visualization
- Job history and management

### System Integration
- System tray icon for background operation
- Desktop shortcuts (Windows/Linux)
- Native file dialogs
- Automatic port detection (8000-8050)

## Technical Details

### Architecture
- **Frontend:** Electron + HTML/CSS/JavaScript
- **Backend:** Docker container (phindagijimana321/neuroinsight:latest)
- **Processing:** FreeSurfer 7.4.1 in isolated containers
- **Storage:** Local filesystem + MinIO S3-compatible backup
- **Database:** PostgreSQL (containerized)
- **Queue:** Redis + Celery (containerized)

### Docker Integration
- Automatic container lifecycle management
- Uses same Docker image as server deployment
- Docker-in-Docker for FreeSurfer processing
- Automatic cleanup and resource management

## Known Issues

### All Platforms
- First FreeSurfer image download requires ~30 minutes on slow connections
- Port 8000 must be available (or app will auto-select 8001-8050)
- Docker must be running before launching the app

### Windows-Specific
- Requires WSL2 enabled
- Docker Desktop must use WSL2 backend
- Some antivirus software may slow first run

### Linux-Specific
- User must be in docker group
- AppImage may require FUSE on some distributions
- Some desktop environments may not support system tray

### Not Yet Implemented
- macOS support (planned for v2.0.0)
- Multi-job queue management UI
- Batch upload interface
- Result comparison view

## Breaking Changes

None - this is the first release.

## Migration Notes

If you were using the Docker deployment:
- Desktop app uses the same Docker image
- Data is stored in Docker volumes (isolated per deployment)
- Both can run simultaneously on different ports
- Configuration is independent

## Documentation

- [README](https://github.com/phindagijimana/neuroinsight_desktop/blob/main/README.md)
- [Installation Guide](https://github.com/phindagijimana/neuroinsight_desktop/blob/main/INSTALL.md)
- [Docker Deployment Docs](https://github.com/phindagijimana/neuroinsight_local)
- [User Guide](https://github.com/phindagijimana/neuroinsight_local/blob/master/docs/USER_GUIDE.md)
- [Troubleshooting](https://github.com/phindagijimana/neuroinsight_local/blob/master/docs/TROUBLESHOOTING.md)

## Related Releases

- [NeuroInsight Docker v1.0.14](https://github.com/phindagijimana/neuroinsight_local/releases/tag/v1.0.14) - Server deployment
- [Docker Image](https://hub.docker.com/r/phindagijimana321/neuroinsight) - phindagijimana321/neuroinsight:latest

## Support

- **Issues:** [GitHub Issues](https://github.com/phindagijimana/neuroinsight_desktop/issues)
- **Main Repository:** [neuroinsight_local](https://github.com/phindagijimana/neuroinsight_local)
- **FreeSurfer:** [FreeSurfer Support](https://surfer.nmr.mgh.harvard.edu/fswiki/FreeSurferSupport)

## License

MIT License

FreeSurfer requires a separate license (free for research use):
https://surfer.nmr.mgh.harvard.edu/registration.html

## Contributors

NeuroInsight Desktop Team

## Acknowledgments

- FreeSurfer Development Team
- Electron Framework
- Docker Community
- University of Rochester

---

© 2025 University of Rochester. All rights reserved.
