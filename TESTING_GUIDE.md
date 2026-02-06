# Testing Guide - NeuroInsight Desktop

## ✅ Step 1 Complete: Dependencies Installed

### What Was Installed

```bash
✅ electron@28.0.0         - Desktop app framework
✅ electron-builder@24.13.3 - Build system for installers
✅ electron-store@8.1.0    - Settings storage
✅ electron-log@5.0.0      - Logging system
✅ axios@1.6.0             - HTTP client
✅ uuid@9.0.0              - Unique ID generation
✅ cross-env@7.0.3         - Cross-platform env vars

Total: 343 packages installed
```

## Important: Display Required

### Current Environment
This is a **headless Linux server** (no display/GUI).

Electron apps require a display to run. You have **3 options**:

### Option 1: Test on Your Local Machine (Recommended ✅)

**On Windows/Mac/Linux Desktop:**

1. **Clone the repository:**
   ```bash
   git clone git@github.com:phindagijimana/neuroinsight_desktop.git
   cd neuroinsight_desktop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development mode:**
   ```bash
   npm run dev
   ```

4. **App will launch!** You'll see:
   - NeuroInsight window with navy blue branding
   - Docker status check
   - UI for uploading MRI files

### Option 2: Use X11 Forwarding (Advanced)

**On your local machine:**
```bash
# SSH with X11 forwarding
ssh -X ubuntu@your-server-ip

# Then on server
cd /home/ubuntu/src/neuroinsight_electron
export DISPLAY=:0
npm run dev
```

**Requirements:**
- X11 server on local machine (XQuartz on Mac, Xming on Windows)
- Good network connection (GUI over SSH is slow)

### Option 3: Use Xvfb (Virtual Display)

**On the server:**
```bash
# Install Xvfb
sudo apt update
sudo apt install xvfb

# Run with virtual display
cd /home/ubuntu/src/neuroinsight_electron
xvfb-run npm run dev

# For debugging
xvfb-run --auto-servernum npm run dev
```

**Note:** This runs the app but you can't see it (useful for automated testing).

## Recommended Testing Workflow

### Development Cycle

**Phase 1: Local Development (Your Machine)**
```bash
# Clone and develop
git clone git@github.com:phindagijimana/neuroinsight_desktop.git
cd neuroinsight_desktop

# Install and run
npm install
npm run dev

# Make changes to code
# See changes immediately (hot reload)
```

**Phase 2: Build Installers (Server)**
```bash
# On server (headless is fine for building)
cd /home/ubuntu/src/neuroinsight_electron

# Build Windows installer
npm run build:win

# Build Linux packages
npm run build:linux

# Installers in dist/ folder
```

**Phase 3: Test Installers (Real OS)**
- Windows: Install `NeuroInsight-Setup.exe` on Windows 10/11
- Linux: Install `NeuroInsight.AppImage` on Ubuntu/Linux Mint

## Quick Test Checklist

### On Your Local Machine

1. **Clone repo:**
   ```bash
   git clone git@github.com:phindagijimana/neuroinsight_desktop.git
   cd neuroinsight_desktop
   ```

2. **Install:**
   ```bash
   npm install
   ```

3. **Run:**
   ```bash
   npm run dev
   ```

4. **Verify:**
   - [ ] App window opens
   - [ ] Navy blue icon visible
   - [ ] Docker status checked
   - [ ] Can click "New Analysis"
   - [ ] Can select files (Browse button)
   - [ ] Settings page works
   - [ ] No console errors

### What to Test

#### Docker Integration
- [ ] App detects Docker Desktop
- [ ] Shows "Docker: Running" or "Docker: Not installed"
- [ ] Can check Docker status from Settings

#### UI Elements
- [ ] Welcome screen displays
- [ ] Can navigate between views
- [ ] Buttons work (New Analysis, Settings, etc.)
- [ ] Toast notifications appear
- [ ] Menu bar (File, Edit, View, Help)

#### File Operations
- [ ] Can browse for MRI files
- [ ] Drag and drop works
- [ ] File path displays correctly

#### System Integration
- [ ] App icon in taskbar
- [ ] Window can resize
- [ ] App can minimize/maximize
- [ ] System tray icon (if implemented)

## Troubleshooting

### "Cannot find module 'electron'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Display not found" Error
You're on a headless server. Use Option 1 (test on local machine).

### Build Fails
```bash
# Clear cache
rm -rf dist/ node_modules/
npm install
npm run build
```

### Port Already in Use
```bash
# Backend port conflict
# App automatically finds available port (8000-8050)
# No action needed
```

## Next Steps After Testing

### When App Works Locally

1. **Build installers:**
   ```bash
   npm run build:win
   npm run build:linux
   ```

2. **Create GitHub Release:**
   - Go to https://github.com/phindagijimana/neuroinsight_desktop/releases
   - Click "Draft a new release"
   - Tag: `v1.0.0`
   - Upload installers from `dist/` folder

3. **Test installers:**
   - Windows: Install and run .exe
   - Linux: Run .AppImage or install .deb

4. **Distribute:**
   - Share GitHub release link
   - Users download and install
   - No source code needed!

## Development Tips

### Hot Reload
When you run `npm run dev`:
- Frontend changes (HTML/CSS/JS) → Reload automatically
- Main process changes (main.js, etc.) → Restart needed

### Debugging

**Main Process (backend):**
```bash
# Console where you ran npm run dev
# Shows electron-log output
```

**Renderer Process (UI):**
- Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
- Opens Chrome DevTools
- Console tab shows frontend logs

**Docker Issues:**
```bash
# On the machine running the app
docker ps
docker logs neuroinsight
```

### File Structure for Changes

**UI changes:**
- `frontend/index.html` - Structure
- `frontend/styles.css` - Styling  
- `frontend/app.js` - Logic

**Backend changes:**
- `src/main/main.js` - App lifecycle
- `src/main/docker-manager.js` - Docker operations
- `src/main/backend-server.js` - Backend management

## Summary

✅ **Dependencies installed** on server
⚠️ **Can't run GUI** on headless server
✅ **Can build installers** on server
✅ **Test on local machine** for development

**Recommended workflow:**
1. Develop on local machine (npm run dev)
2. Push changes to GitHub
3. Build installers on server
4. Test installers on real Windows/Linux machines

## Ready for Next Steps

Now that dependencies are installed, you can:

1. ✅ Build installers (works on headless server)
2. ✅ Set up CI/CD for automated builds
3. ✅ Create GitHub releases
4. ⚠️ Test GUI (need local machine with display)

Would you like to proceed with building installers or setting up GitHub releases?
