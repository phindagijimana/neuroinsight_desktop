# NeuroInsight Desktop Icons

## Icon Design

**Color:** Navy Blue `#003d7a` (same as "Start Processing" button)  
**Design:** Square icon with "NeuroInsight" text and brain symbol  
**Style:** Professional, clean, modern

## Generated Files

### Main Icons
- `icon.png` (512x512) - Main icon for electron-builder
- `icon.ico` - Windows multi-size icon
- `icon.svg` - Source vector file

### Multi-size PNG Icons
Located in `icons/` folder:
- `icon-16.png` (16x16)
- `icon-32.png` (32x32)
- `icon-48.png` (48x48)
- `icon-64.png` (64x64)
- `icon-128.png` (128x128)
- `icon-256.png` (256x256)
- `icon-512.png` (512x512)
- `icon-1024.png` (1024x1024)

## How Icons Are Used

### Windows
- Desktop icon
- Start Menu icon
- Taskbar icon
- Title bar icon
- File associations

### Linux
- Application launcher icon
- Window icon
- Desktop shortcut icon

### macOS
- Dock icon
- Finder icon
- Launchpad icon

## Regenerating Icons

If you need to regenerate icons:

```bash
# Using Python (recommended)
cd build
python3 create_icon.py

# Or using shell script (requires rsvg-convert or inkscape)
./generate-icons.sh
```

## Customization

To change the icon design, edit:
- `create_icon.py` - Modify colors, text, layout
- `icon.svg` - Edit the SVG source directly

### Changing Colors

Edit `create_icon.py`:
```python
NAVY_BLUE = "#003d7a"  # Change this to your color
WHITE = "#ffffff"       # Change text color if needed
```

Then regenerate:
```bash
python3 create_icon.py
```

## electron-builder Integration

The `icon.png` file is automatically used by electron-builder to generate:
- Windows: `.ico` file with multiple sizes
- Linux: PNG icons at various sizes
- macOS: `.icns` file with retina support

No additional configuration needed - electron-builder handles everything!

## Brand Guidelines

**NeuroInsight Brand Colors:**
- Primary: `#003d7a` (Navy Blue)
- Text: `#ffffff` (White)
- Accent: `#002b55` (Darker Blue for hover states)

**Icon Usage:**
- Maintain square aspect ratio
- Use navy blue background
- Keep text legible at all sizes
- Include brain symbol for brand recognition

## Technical Specifications

### Windows (.ico)
- Sizes: 16, 32, 48, 64, 128, 256 pixels
- Format: ICO with multiple sizes embedded
- Color depth: 32-bit RGBA

### Linux (.png)
- Sizes: 16, 32, 48, 64, 128, 256, 512 pixels
- Format: PNG with transparency
- Recommended: 512x512 for high-DPI displays

### macOS (.icns)
- Sizes: 16, 32, 128, 256, 512, 1024 pixels
- Retina: @2x versions for each size
- Format: ICNS (Apple Icon Image)
- Generated automatically by electron-builder from icon.png
