# Linux Installation - Simple & Quick

## Quick Install (2 Commands)

### AppImage (Universal Linux)

```bash
# Download
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.AppImage

# Make executable and run
chmod +x NeuroInsight-1.0.0.AppImage
./NeuroInsight-1.0.0.AppImage
```

**That's it!** Works on any Linux distro.

### Debian Package (Ubuntu/Debian/Mint)

```bash
# Download
wget https://github.com/phindagijimana/neuroinsight_desktop/releases/download/v1.0.0/NeuroInsight-1.0.0.deb

# Install
sudo dpkg -i NeuroInsight-1.0.0.deb

# Run
neuroinsight
```

---

## What Each Method Does

### AppImage (Portable)
- ✅ No installation needed
- ✅ Runs from any folder
- ✅ Works on all Linux distros
- ✅ No root/sudo required
- ✅ Easy to remove (just delete file)

**Use if:** You want portable, no-installation version

### DEB Package (System Install)
- ✅ Installs to `/opt/NeuroInsight`
- ✅ Adds to application menu
- ✅ Creates command: `neuroinsight`
- ✅ Easy uninstall: `sudo apt remove neuroinsight`

**Use if:** You want system integration

---

## Requirements

- **Linux:** Any distro (AppImage) or Debian-based (.deb)
- **Docker:** Docker Desktop or Docker Engine
- **RAM:** 8GB minimum (16GB recommended)
- **Disk:** 50GB free space
- **Internet:** For first-time FreeSurfer download

---

## After Installation

1. **Launch the app:**
   ```bash
   # AppImage
   ./NeuroInsight-1.0.0.AppImage
   
   # Or DEB
   neuroinsight
   ```

2. **App checks Docker:**
   - If Docker not installed → Shows download link
   - If Docker not running → Asks you to start it

3. **First job:**
   - FreeSurfer image downloads (~7GB, 10-30 minutes)
   - Then processing starts
   - Processing takes 3-7 hours (normal)

---

## Optional: Add to System Menu

If you want AppImage in your application menu:

```bash
# Install to ~/.local/bin
mkdir -p ~/.local/bin
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

# Update menu
update-desktop-database ~/.local/share/applications 2>/dev/null || true
```

Now it appears in your application menu!

---

## Uninstalling

### AppImage
```bash
# Just delete the file
rm NeuroInsight-1.0.0.AppImage

# If installed to system menu:
rm ~/.local/bin/NeuroInsight.AppImage
rm ~/.local/share/applications/neuroinsight.desktop
```

### DEB Package
```bash
sudo apt remove neuroinsight
```

---

## Troubleshooting

### "Permission denied"
```bash
# Make sure it's executable
chmod +x NeuroInsight-1.0.0.AppImage
```

### "Docker not found"
```bash
# Install Docker
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo usermod -aG docker $USER
# Log out and back in
```

### "Cannot open display"
```bash
# You're on a server without GUI
# Run on a desktop Linux machine instead
```

---

## Summary

**AppImage (Universal):**
```bash
wget <url>
chmod +x NeuroInsight-1.0.0.AppImage
./NeuroInsight-1.0.0.AppImage
```

**DEB (Debian/Ubuntu):**
```bash
wget <url>
sudo dpkg -i NeuroInsight-1.0.0.deb
neuroinsight
```

**Simple, straightforward, works everywhere!** ✅
