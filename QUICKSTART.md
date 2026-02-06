# Quick Start Guide - NeuroInsight Electron

## For Developers (Building the App)

### Step 1: Install Prerequisites

```bash
# Install Node.js 18+ from https://nodejs.org
node --version  # Should show v18 or higher

# Install Docker Desktop from https://www.docker.com/products/docker-desktop/
docker --version  # Verify installation
```

### Step 2: Clone and Setup

```bash
cd /path/to/neuroinsight_electron

# Install dependencies
npm install
```

### Step 3: Run Development Build

```bash
npm run dev
```

The app will launch! You should see the NeuroInsight window.

### Step 4: Build Installers

```bash
# For Windows (run on Windows)
npm run build:win

# For Linux (run on Linux)
npm run build:linux

# Results in dist/ folder
```

## For End Users (Using the App)

### Windows Users

1. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/
   - Run installer
   - Restart computer if prompted
   - Launch Docker Desktop (wait for it to start fully)

2. **Install NeuroInsight**
   - Download `NeuroInsight-Setup-1.0.0.exe`
   - Double-click to install
   - Follow wizard

3. **First Launch**
   - Find "NeuroInsight" in Start Menu
   - Click to launch
   - App will check Docker automatically

4. **Create First Analysis**
   - Click "New Analysis"
   - Select your MRI file (.nii, .nii.gz, or .dcm)
   - Click "Start Analysis"
   - First time: FreeSurfer image downloads (~7GB, 10-30 minutes)
   - Processing: 3-7 hours (normal for MRI analysis)

### Linux Users

1. **Install Docker**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install docker.io
   sudo systemctl start docker
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

2. **Install NeuroInsight**
   ```bash
   # AppImage (recommended)
   chmod +x NeuroInsight-1.0.0.AppImage
   ./NeuroInsight-1.0.0.AppImage

   # Or .deb package
   sudo dpkg -i neuroinsight_1.0.0_amd64.deb
   neuroinsight
   ```

3. **Use the app** (same as Windows above)

## Troubleshooting

### "Docker not found"
- **Solution**: Install Docker Desktop and make sure it's running
- Check: Open terminal and type `docker ps` - should work without errors

### "Docker not running"
- **Windows/Mac**: Start Docker Desktop from Start Menu or Applications
- **Linux**: `sudo systemctl start docker`

### "Port in use"
- App automatically finds available ports
- If problem persists, restart the app

### Build fails with "command not found"
- Ensure Node.js 18+ is installed: `node --version`
- Ensure npm is installed: `npm --version`
- Try: `rm -rf node_modules && npm install`

## Development Tips

### Quick Iteration
```bash
# Terminal 1: Watch and rebuild automatically
npm run dev

# Make changes to files
# App auto-reloads (for most changes)
# For main process changes, restart the terminal command
```

### Check Logs
- **Main process**: Check terminal where you ran `npm run dev`
- **Renderer process**: Open DevTools in app (Ctrl+Shift+I)

### Test Docker Integration
```bash
# Verify Docker works
docker ps

# Check NeuroInsight container
docker ps -a | grep neuroinsight

# View logs
docker logs neuroinsight
```

## What to Build First

### For Testing
```bash
# Package without installer (faster)
npm run pack
# Output: dist/linux-unpacked/ or dist/win-unpacked/
```

### For Distribution
```bash
# Build full installer
npm run build

# Windows output:
# - dist/NeuroInsight-Setup-1.0.0.exe (installer)
# - dist/NeuroInsight-Portable-1.0.0.exe (portable)

# Linux output:
# - dist/NeuroInsight-1.0.0.AppImage (portable)
# - dist/neuroinsight_1.0.0_amd64.deb (Debian)
```

## Key Files to Customize

### Change App Name
Edit `package.json`:
```json
{
  "name": "your-app-name",
  "productName": "Your App Name",
  "build": {
    "appId": "com.yourcompany.yourapp"
  }
}
```

### Change Icons
Replace files in `build/`:
- `icon.png` (512x512) for Linux
- `icon.ico` for Windows
- `icon.icns` for macOS

### Modify UI
Edit files in `frontend/`:
- `index.html` - Structure
- `styles.css` - Styling
- `app.js` - Logic

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev` to test
3. ✅ Make changes to UI or logic
4. ✅ Build with `npm run build`
5. ✅ Test the built installer
6. ✅ Distribute to users!

## Resources

- **Full README**: See `README.md`
- **Development Guide**: See `DEVELOPMENT.md`
- **Electron Docs**: https://www.electronjs.org/docs
- **Docker Docs**: https://docs.docker.com/

## Getting Help

- Check `DEVELOPMENT.md` for detailed guides
- Review Electron documentation
- Ask in project discussions
- File issues on GitHub

## Success Checklist

- [ ] Node.js 18+ installed
- [ ] Docker installed and running
- [ ] `npm install` completed successfully
- [ ] `npm run dev` launches the app
- [ ] App shows "Docker: Running" status
- [ ] Can select MRI file
- [ ] Can build installer with `npm run build`
- [ ] Built app runs on target platform

**If all checked: You're ready to develop and distribute NeuroInsight Desktop!** 🎉
