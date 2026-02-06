# NeuroInsight Desktop

Cross-platform Electron desktop application for automated MRI brain analysis using FreeSurfer.

## Features

- ✅ **Cross-platform**: Works on Windows, Linux, and macOS
- ✅ **Docker Integration**: Uses Docker containers for FreeSurfer processing
- ✅ **Native Desktop Experience**: Standalone application with system integration
- ✅ **User-Friendly Interface**: Modern, intuitive UI for MRI analysis
- ✅ **Auto-Updates**: Built-in update mechanism (future)
- ✅ **Offline Capable**: Works without constant internet connection

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11 (64-bit), Ubuntu 20.04+, or macOS 11+
- **RAM**: 8GB (16GB recommended)
- **CPU**: 4+ cores
- **Disk Space**: 50GB free (for FreeSurfer and data)
- **Docker**: Docker Desktop or Docker Engine

### Prerequisites
1. **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
   - Download: https://www.docker.com/products/docker-desktop/
   - Windows: Includes WSL2 (installed automatically)
   - Linux: Install from package manager
   - macOS: Includes Linux VM

2. **FreeSurfer License** (free for research)
   - Register: https://surfer.nmr.mgh.harvard.edu/registration.html
   - Place `license.txt` in app data directory

## Installation

### For End Users

#### Windows
1. Download `NeuroInsight-Setup-1.0.0.exe`
2. Run the installer
3. Follow the setup wizard
4. Launch from Start Menu

#### Linux
```bash
# AppImage (recommended)
chmod +x NeuroInsight-1.0.0.AppImage
./NeuroInsight-1.0.0.AppImage

# Or Debian package
sudo dpkg -i neuroinsight_1.0.0_amd64.deb
```

#### macOS
1. Download `NeuroInsight-1.0.0.dmg`
2. Open the DMG file
3. Drag NeuroInsight to Applications
4. Launch from Applications folder

### For Developers

#### Clone and Install Dependencies
```bash
git clone https://github.com/yourusername/neuroinsight_electron.git
cd neuroinsight_electron
npm install
```

#### Development Mode
```bash
npm run dev
```

This will start the Electron app in development mode with hot reload.

#### Build for Production

```bash
# Build for current platform
npm run build

# Build for specific platform
npm run build:win     # Windows
npm run build:linux   # Linux
npm run build:all     # All platforms
```

Built applications will be in the `dist/` folder.

## Usage

### First-Time Setup

1. **Install Docker Desktop**
   - Windows/Mac: Docker Desktop automatically installs WSL2/VM
   - Linux: Install Docker Engine from package manager

2. **Start Docker**
   - Ensure Docker is running before launching NeuroInsight
   - Check system tray/menu bar for Docker icon

3. **Launch NeuroInsight**
   - The app will automatically check Docker status
   - On first analysis, FreeSurfer image (~7GB) will be downloaded

### Creating an Analysis

1. Click **"New Analysis"**
2. Select or drag-and-drop your MRI file (.nii, .nii.gz, or .dcm)
3. Click **"Start Analysis"**
4. Processing will take 3-7 hours (typical for FreeSurfer)

### Monitoring Progress

- Jobs run in the background
- You can close the app; processing continues
- Check progress in the "View Jobs" section

## Architecture

```
NeuroInsight Desktop
├── Electron Shell (Cross-platform)
│   ├── Main Process (Node.js backend)
│   └── Renderer Process (Frontend UI)
│
├── Backend (Docker Container)
│   ├── FastAPI Server
│   ├── PostgreSQL Database
│   ├── Redis Queue
│   └── MinIO Storage
│
└── FreeSurfer Processing (Docker Container)
    └── FreeSurfer 7.4.1
```

### How It Works

1. **Electron App** provides native desktop interface
2. **Backend Container** manages jobs and data (same as web deployment)
3. **FreeSurfer Container** processes MRI scans (spawned per job)
4. **Docker Desktop/Engine** runs all containers

**Key Point:** Same Docker containers as web deployment = consistent behavior!

## Development

### Project Structure

```
neuroinsight_electron/
├── src/
│   ├── main/               # Electron main process
│   │   ├── main.js         # App entry point
│   │   ├── preload.js      # Context bridge
│   │   ├── docker-manager.js    # Docker operations
│   │   ├── backend-server.js    # Backend management
│   │   └── system-check.js      # System requirements
│   ├── renderer/           # Future: React renderer
│   └── shared/             # Shared utilities
├── frontend/               # Current: Simple HTML/CSS/JS
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── build/                  # Build resources (icons)
├── resources/              # App resources
├── package.json            # Dependencies and build config
└── README.md              # This file
```

### Key Technologies

- **Electron**: Desktop app framework
- **Node.js**: Backend runtime
- **Docker**: Container management
- **electron-builder**: Build and packaging
- **electron-store**: Settings persistence
- **electron-log**: Logging

### Building

#### Prerequisites for Building
- Node.js 18+ and npm
- For Windows builds: Windows 10/11
- For Linux builds: Ubuntu 20.04+
- For macOS builds: macOS 11+

#### Build Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Package without creating installer
npm run pack

# Build installer for current platform
npm run build

# Build for specific platform
npm run build:win
npm run build:linux

# Build for all platforms (requires appropriate OS)
npm run build:all
```

#### Build Output

```
dist/
├── NeuroInsight-Setup-1.0.0.exe           # Windows installer
├── NeuroInsight-Portable-1.0.0.exe        # Windows portable
├── NeuroInsight-1.0.0.AppImage            # Linux AppImage
├── neuroinsight_1.0.0_amd64.deb          # Debian package
└── NeuroInsight-1.0.0.dmg                # macOS disk image
```

## Troubleshooting

### Docker Not Found

**Problem:** App says "Docker is not installed"

**Solution:**
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop
3. Wait for Docker to fully start (icon steady in system tray)
4. Restart NeuroInsight

### Docker Not Running

**Problem:** App says "Docker is not running"

**Solution:**
- Windows/Mac: Start Docker Desktop from Start Menu or Applications
- Linux: `sudo systemctl start docker`

### Port Already in Use

**Problem:** Backend fails to start

**Solution:**
- App automatically finds available ports
- If issue persists, close other apps using ports 8000-8050

### FreeSurfer Download Fails

**Problem:** FreeSurfer image download fails

**Solution:**
1. Check internet connection
2. Check Docker has enough disk space (need ~7GB free)
3. Try: Settings → Download FreeSurfer

### Analysis Stuck

**Problem:** Job shows "Processing" for too long

**Solution:**
- FreeSurfer takes 3-7 hours normally
- Check Docker Desktop → Containers for logs
- If stuck > 12 hours, may be a problem

## Configuration

### App Data Locations

- **Windows**: `%APPDATA%\neuroinsight-desktop`
- **Linux**: `~/.config/neuroinsight-desktop`
- **macOS**: `~/Library/Application Support/neuroinsight-desktop`

### Docker Volume

Data is stored in Docker volume: `neuroinsight-data`

View with: `docker volume inspect neuroinsight-data`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms if possible
5. Submit a pull request

## License

MIT License - see LICENSE file

## Support

- **Documentation**: https://neuroinsight.docs
- **Issues**: https://github.com/neuroinsight/neuroinsight_electron/issues
- **Discussions**: https://github.com/neuroinsight/neuroinsight_electron/discussions

## Acknowledgments

- FreeSurfer: https://surfer.nmr.mgh.harvard.edu/
- Electron: https://www.electronjs.org/
- Docker: https://www.docker.com/

## Version History

### v1.0.0 (2024)
- Initial release
- Cross-platform support (Windows, Linux, macOS)
- Docker integration
- FreeSurfer 7.4.1 support
- Modern desktop UI
