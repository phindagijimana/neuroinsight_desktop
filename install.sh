#!/bin/bash
# NeuroInsight Desktop - Quick Installer for Linux
# Handles AppImage setup automatically

set -e

APPIMAGE_URL="https://github.com/phindagijimana/neuroinsight_desktop/releases/latest/download/NeuroInsight-1.0.0.AppImage"
APPIMAGE_NAME="NeuroInsight.AppImage"
INSTALL_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons/hicolor/512x512/apps"

echo "🧠 NeuroInsight Desktop Installer"
echo "=================================="
echo ""

# Check if already downloaded
if [ -f "$APPIMAGE_NAME" ]; then
    echo "✓ AppImage found: $APPIMAGE_NAME"
else
    # Check if we have a specific file
    if [ -f "NeuroInsight-1.0.0.AppImage" ]; then
        APPIMAGE_NAME="NeuroInsight-1.0.0.AppImage"
        echo "✓ AppImage found: $APPIMAGE_NAME"
    else
        echo "AppImage not found. Please download it first:"
        echo "  wget $APPIMAGE_URL"
        echo ""
        echo "Or place NeuroInsight-1.0.0.AppImage in this folder and run again."
        exit 1
    fi
fi

# Make executable (this is the automated chmod!)
echo "Making executable..."
chmod +x "$APPIMAGE_NAME"
echo "✓ Made executable"

# Option 1: Just run it
echo ""
echo "Choose installation type:"
echo "  1) Run once (portable, no installation)"
echo "  2) Install to system (adds to menu, creates shortcut)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Launching NeuroInsight..."
    "./$APPIMAGE_NAME"
    exit 0
fi

# Option 2: Install to system
echo ""
echo "Installing to system..."

# Create directories
mkdir -p "$INSTALL_DIR"
mkdir -p "$DESKTOP_DIR"
mkdir -p "$ICON_DIR"

# Copy AppImage to local bin
cp "$APPIMAGE_NAME" "$INSTALL_DIR/NeuroInsight.AppImage"
chmod +x "$INSTALL_DIR/NeuroInsight.AppImage"
echo "✓ Copied to $INSTALL_DIR"

# Extract icon from AppImage
"./$APPIMAGE_NAME" --appimage-extract-and-run --appimage-help &>/dev/null || true
if [ -f "squashfs-root/neuroinsight-desktop.png" ]; then
    cp "squashfs-root/neuroinsight-desktop.png" "$ICON_DIR/neuroinsight.png"
    rm -rf squashfs-root
    echo "✓ Extracted icon"
fi

# Create desktop entry
cat > "$DESKTOP_DIR/neuroinsight.desktop" << EOF
[Desktop Entry]
Type=Application
Name=NeuroInsight
Comment=Automated MRI Brain Analysis
Exec=$INSTALL_DIR/NeuroInsight.AppImage
Icon=neuroinsight
Terminal=false
Categories=Science;MedicalSoftware;
StartupWMClass=NeuroInsight
EOF

chmod +x "$DESKTOP_DIR/neuroinsight.desktop"
echo "✓ Created desktop entry"

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "NeuroInsight is now available:"
echo "  • Application menu: Search for 'NeuroInsight'"
echo "  • Command line: NeuroInsight.AppImage"
echo "  • Installed to: $INSTALL_DIR"
echo ""
echo "To uninstall:"
echo "  rm $INSTALL_DIR/NeuroInsight.AppImage"
echo "  rm $DESKTOP_DIR/neuroinsight.desktop"
echo ""

# Ask to launch
read -p "Launch NeuroInsight now? (y/n): " launch
if [ "$launch" = "y" ] || [ "$launch" = "Y" ]; then
    "$INSTALL_DIR/NeuroInsight.AppImage" &
    echo "✓ Launched!"
fi
