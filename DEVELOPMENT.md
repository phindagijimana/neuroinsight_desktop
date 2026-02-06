# Development Guide - NeuroInsight Electron

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for current platform
npm run build
```

## Development Setup

### Prerequisites

1. **Node.js 18+** and npm
2. **Docker Desktop** (for testing)
3. **Git**

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd neuroinsight_electron

# Install dependencies
npm install

# Run development build
npm run dev
```

## Project Architecture

### Main Process (`src/main/`)

The Electron main process runs in Node.js and handles:
- Application lifecycle
- Window management
- System integration (menus, tray)
- Docker operations
- Backend server management

**Key files:**
- `main.js` - Entry point, window creation
- `docker-manager.js` - Docker operations
- `backend-server.js` - Backend container management
- `system-check.js` - System requirements checking
- `preload.js` - Context bridge for renderer

### Renderer Process (`frontend/`)

The renderer process displays the UI:
- Runs in Chromium (sandboxed)
- Can only access Electron APIs via preload script
- Uses HTML/CSS/JavaScript (can be upgraded to React)

**Key files:**
- `index.html` - Main UI structure
- `styles.css` - Styling
- `app.js` - Frontend logic

### Communication Flow

```
Frontend (Renderer)
    ↓ (via contextBridge)
Preload Script
    ↓ (via IPC)
Main Process
    ↓
Docker / Backend / System
```

## Development Workflow

### Running the App

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode (test built version)
npm start
```

### Debugging

#### Main Process
- Logs go to console where you ran `npm run dev`
- Use `console.log()` or `log.info()` from electron-log

#### Renderer Process
- Open DevTools in the app window (Ctrl+Shift+I or Cmd+Option+I)
- Check Console tab for logs

#### Docker Issues
```bash
# Check Docker status
docker --version
docker ps

# View NeuroInsight container logs
docker logs neuroinsight

# Check container status
docker ps -a | grep neuroinsight
```

### Testing Docker Integration

```bash
# Pull NeuroInsight image manually
docker pull phindagijimana321/neuroinsight:latest

# Run container manually (for testing)
docker run -d --name neuroinsight \
  -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v neuroinsight-data:/data \
  phindagijimana321/neuroinsight:latest

# Check container
docker ps
curl http://localhost:8000/api/health

# Stop and remove
docker stop neuroinsight
docker rm neuroinsight
```

## Building

### Development Build

```bash
# Package but don't create installer (faster for testing)
npm run pack
```

### Production Build

```bash
# Build for current platform
npm run build

# Build for specific platform
npm run build:win      # Windows
npm run build:linux    # Linux
npm run build:all      # All platforms (if supported)
```

### Build Configuration

Edit `package.json` → `build` section for:
- App ID and name
- Icons
- File associations
- Auto-update settings
- Platform-specific options

## Platform-Specific Notes

### Windows Development

**Requirements:**
- Windows 10/11
- Node.js 18+
- Docker Desktop for Windows

**Build:**
```bash
npm run build:win
```

**Output:**
- `dist/NeuroInsight-Setup-1.0.0.exe` - Installer
- `dist/NeuroInsight-Portable-1.0.0.exe` - Portable version

**Testing:**
- Test on Windows 10 and 11
- Test with/without Docker Desktop installed
- Test installation and uninstallation

### Linux Development

**Requirements:**
- Ubuntu 20.04+ (or similar)
- Node.js 18+
- Docker Engine

**Build:**
```bash
npm run build:linux
```

**Output:**
- `dist/NeuroInsight-1.0.0.AppImage` - Universal Linux app
- `dist/neuroinsight_1.0.0_amd64.deb` - Debian package

**Testing:**
```bash
# Test AppImage
chmod +x dist/NeuroInsight-1.0.0.AppImage
./dist/NeuroInsight-1.0.0.AppImage

# Test .deb
sudo dpkg -i dist/neuroinsight_1.0.0_amd64.deb
neuroinsight
```

### macOS Development

**Requirements:**
- macOS 11+
- Node.js 18+
- Docker Desktop for Mac
- Apple Developer account (for code signing)

**Build:**
```bash
npm run build:mac
```

**Output:**
- `dist/NeuroInsight-1.0.0.dmg` - macOS disk image

## Code Style

### JavaScript/Node.js

- Use ES6+ features
- Async/await for asynchronous code
- JSDoc comments for functions
- 2 spaces indentation

Example:
```javascript
/**
 * Check Docker status
 * @returns {Promise<Object>} Docker status object
 */
async function checkDockerStatus() {
  try {
    const result = await execAsync('docker --version');
    return { installed: true, version: result.stdout };
  } catch (error) {
    return { installed: false, error: error.message };
  }
}
```

### Error Handling

Always handle errors gracefully:

```javascript
try {
  await dockerManager.pullImage(imageName);
  showToast('Image downloaded successfully', 'success');
} catch (error) {
  log.error('Failed to pull image:', error);
  showToast('Failed to download image', 'error');
}
```

### Logging

Use electron-log for all logging:

```javascript
const log = require('electron-log');

log.info('Application started');
log.warn('Docker not found');
log.error('Failed to start backend:', error);
log.debug('Debug information');
```

## Adding Features

### Adding a New IPC Handler

1. **Main process** (`src/main/main.js`):
```javascript
ipcMain.handle('my-feature:action', async (event, arg) => {
  // Handle the action
  return result;
});
```

2. **Preload** (`src/main/preload.js`):
```javascript
contextBridge.exposeInMainWorld('electron', {
  myFeature: {
    doAction: (arg) => ipcRenderer.invoke('my-feature:action', arg)
  }
});
```

3. **Renderer** (`frontend/app.js`):
```javascript
async function myFunction() {
  const result = await window.electron.myFeature.doAction(arg);
  console.log(result);
}
```

### Adding a New View

1. **HTML** (`frontend/index.html`):
```html
<div id="my-view" class="my-view" style="display: none;">
  <h2>My View</h2>
  <!-- Content -->
</div>
```

2. **CSS** (`frontend/styles.css`):
```css
.my-view {
  /* Styles */
}
```

3. **JavaScript** (`frontend/app.js`):
```javascript
function showMyView() {
  showView('my-view');
  // Load data
}
```

## Testing

### Manual Testing Checklist

- [ ] App starts successfully
- [ ] Docker status detection works
- [ ] File selection (browse and drag-and-drop)
- [ ] Job creation
- [ ] Backend connectivity
- [ ] Settings page
- [ ] System requirements check
- [ ] Menu items work
- [ ] Window resize/minimize/maximize
- [ ] App quit and cleanup

### Platform Testing

Test on each target platform:
- [ ] Windows 10
- [ ] Windows 11
- [ ] Ubuntu 20.04
- [ ] Ubuntu 22.04
- [ ] macOS 11+

## Troubleshooting Development Issues

### "Cannot find module" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails

```bash
# Clear electron-builder cache
rm -rf ~/Library/Caches/electron-builder  # macOS
rm -rf ~/.cache/electron-builder           # Linux
del /s /q %LOCALAPPDATA%\electron-builder  # Windows

# Rebuild
npm run build
```

### Docker connection issues

```bash
# Check Docker is running
docker ps

# Restart Docker Desktop
# Windows/Mac: Restart from system tray
# Linux: sudo systemctl restart docker
```

### App won't start

```bash
# Check logs
# Windows: %APPDATA%\neuroinsight-desktop\logs
# Linux: ~/.config/neuroinsight-desktop/logs
# macOS: ~/Library/Logs/neuroinsight-desktop
```

## Release Process

1. **Update version** in `package.json`
2. **Update CHANGELOG.md**
3. **Build all platforms**:
   ```bash
   npm run build:win
   npm run build:linux
   npm run build:mac
   ```
4. **Test all builds**
5. **Create GitHub release**
6. **Upload artifacts**
7. **Update documentation**

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [IPC Communication](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)

## Getting Help

- Check existing issues on GitHub
- Ask in discussions
- Review Electron documentation
- Check Docker documentation
