#!/bin/bash
# Generate app icons from SVG

set -e

echo "Generating NeuroInsight Desktop Icons..."

# Check if required tools are installed
if ! command -v rsvg-convert &> /dev/null && ! command -v inkscape &> /dev/null; then
    echo "[WARNING] Neither rsvg-convert nor inkscape found."
    echo "   Install one of them:"
    echo "   - Ubuntu/Debian: sudo apt install librsvg2-bin"
    echo "   - macOS: brew install librsvg"
    echo ""
    echo "   For now, using the SVG as-is."
    echo "   electron-builder will handle conversion automatically."
    exit 0
fi

# Create output directory
mkdir -p icons

# Determine which tool to use
if command -v rsvg-convert &> /dev/null; then
    CONVERTER="rsvg-convert"
    echo "Using rsvg-convert..."
elif command -v inkscape &> /dev/null; then
    CONVERTER="inkscape"
    echo "Using inkscape..."
fi

# Generate PNG icons at various sizes
for size in 16 32 48 64 128 256 512 1024; do
    echo "Generating ${size}x${size} PNG..."
    
    if [ "$CONVERTER" = "rsvg-convert" ]; then
        rsvg-convert -w $size -h $size icon.svg -o icons/icon-${size}.png
    elif [ "$CONVERTER" = "inkscape" ]; then
        inkscape icon.svg -w $size -h $size -o icons/icon-${size}.png
    fi
done

# Copy the 512x512 as the main icon.png
cp icons/icon-512.png icon.png

echo "[OK] PNG icons generated!"

# Generate Windows ICO (requires ImageMagick)
if command -v convert &> /dev/null || command -v magick &> /dev/null; then
    echo "Generating Windows .ico file..."
    
    if command -v magick &> /dev/null; then
        # ImageMagick 7+
        magick icons/icon-{16,32,48,64,128,256}.png icon.ico
    else
        # ImageMagick 6
        convert icons/icon-{16,32,48,64,128,256}.png icon.ico
    fi
    
    echo "[OK] Windows ICO generated!"
else
    echo "[WARNING] ImageMagick not found. Skipping .ico generation."
    echo "   Install: sudo apt install imagemagick"
    echo "   electron-builder can generate .ico automatically."
fi

# Generate macOS ICNS (requires iconutil on macOS)
if [[ "$OSTYPE" == "darwin"* ]] && command -v iconutil &> /dev/null; then
    echo "Generating macOS .icns file..."
    
    # Create iconset directory
    mkdir -p NeuroInsight.iconset
    
    # Copy PNGs with correct naming
    cp icons/icon-16.png NeuroInsight.iconset/icon_16x16.png
    cp icons/icon-32.png NeuroInsight.iconset/icon_16x16@2x.png
    cp icons/icon-32.png NeuroInsight.iconset/icon_32x32.png
    cp icons/icon-64.png NeuroInsight.iconset/icon_32x32@2x.png
    cp icons/icon-128.png NeuroInsight.iconset/icon_128x128.png
    cp icons/icon-256.png NeuroInsight.iconset/icon_128x128@2x.png
    cp icons/icon-256.png NeuroInsight.iconset/icon_256x256.png
    cp icons/icon-512.png NeuroInsight.iconset/icon_256x256@2x.png
    cp icons/icon-512.png NeuroInsight.iconset/icon_512x512.png
    cp icons/icon-1024.png NeuroInsight.iconset/icon_512x512@2x.png
    
    # Generate ICNS
    iconutil -c icns NeuroInsight.iconset -o icon.icns
    
    # Cleanup
    rm -rf NeuroInsight.iconset
    
    echo "[OK] macOS ICNS generated!"
else
    echo "[INFO] Skipping .icns generation (macOS only)."
    echo "   electron-builder can generate .icns automatically."
fi

echo ""
echo "[OK] Icon generation complete!"
echo ""
echo "Generated files:"
ls -lh icon.png icon.ico icon.icns 2>/dev/null || ls -lh icon.png 2>/dev/null || echo "  icon.svg (ready for electron-builder)"
echo ""
echo "Note: electron-builder will automatically convert icon.png"
echo "      to all required formats during the build process."
