#!/usr/bin/env python3
"""
Generate NeuroInsight Desktop App Icon
Navy blue square with "NeuroInsight" text and brain icon
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Colors
NAVY_BLUE = "#003d7a"
WHITE = "#ffffff"

def create_icon(size=512, output_path="icon.png"):
    """Create a rounded square icon with NeuroInsight branding"""
    
    # Create image with transparent background first
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded rectangle background (navy blue)
    corner_radius = size // 8  # Smooth rounded corners
    draw.rounded_rectangle(
        [(0, 0), (size, size)],
        radius=corner_radius,
        fill=NAVY_BLUE
    )
    
    # Calculate sizes relative to image size
    corner_radius = size // 8
    padding = size // 20
    
    # Try to load a nice font, fallback to default
    try:
        # Try different font paths for different systems
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "C:\\Windows\\Fonts\\arialbd.ttf",
        ]
        
        font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, size // 9)
                break
        
        if font is None:
            font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()
    
    # Draw simplified brain icon at top
    brain_y = size // 4
    brain_size = size // 6
    
    # Brain outline (simple oval)
    brain_bbox = [
        size // 2 - brain_size,
        brain_y - brain_size // 2,
        size // 2 + brain_size,
        brain_y + brain_size // 2
    ]
    draw.ellipse(brain_bbox, fill=WHITE)
    
    # Add some brain details (simplified)
    # Left hemisphere curve
    draw.arc([brain_bbox[0], brain_bbox[1], size // 2, brain_bbox[3]], 
             start=180, end=360, fill=NAVY_BLUE, width=size // 80)
    # Right hemisphere curve
    draw.arc([size // 2, brain_bbox[1], brain_bbox[2], brain_bbox[3]], 
             start=0, end=180, fill=NAVY_BLUE, width=size // 80)
    
    # Draw "NeuroInsight" text (single line with good margins)
    # Calculate text size that fits with margins
    margin = size // 8  # 12.5% margin on each side
    max_text_width = size - (2 * margin)
    
    # Try to load font that fits nicely
    try:
        font_large = None
        # Try different font sizes to find one that fits
        for font_size in range(size // 5, size // 20, -2):
            for font_path in font_paths:
                if os.path.exists(font_path):
                    test_font = ImageFont.truetype(font_path, font_size)
                    test_bbox = draw.textbbox((0, 0), "NeuroInsight", font=test_font)
                    test_width = test_bbox[2] - test_bbox[0]
                    
                    if test_width <= max_text_width:
                        font_large = test_font
                        break
            if font_large:
                break
        
        if font_large is None:
            font_large = font
    except:
        font_large = font
    
    # "NeuroInsight" as single word
    text = "NeuroInsight"
    bbox = draw.textbbox((0, 0), text, font=font_large)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (size - text_width) // 2
    text_y = size * 2 // 3  # Centered in lower half
    draw.text((text_x, text_y), text, fill=WHITE, font=font_large)
    
    # Convert RGBA to RGB for formats that don't support transparency
    if output_path.endswith('.png'):
        # Keep RGBA for PNG
        img.save(output_path, 'PNG')
    else:
        # Convert to RGB for other formats
        rgb_img = Image.new('RGB', img.size, NAVY_BLUE)
        rgb_img.paste(img, (0, 0), img)
        rgb_img.save(output_path)
    
    print(f"✅ Created {output_path} ({size}x{size})")
    
    return img

def main():
    """Generate all required icon sizes"""
    print("🎨 Generating NeuroInsight Desktop Icons...")
    print(f"   Using navy blue color: {NAVY_BLUE}")
    print()
    
    # Create output directory
    os.makedirs("icons", exist_ok=True)
    
    # Generate various sizes
    sizes = [16, 32, 48, 64, 128, 256, 512, 1024]
    
    for size in sizes:
        create_icon(size, f"icons/icon-{size}.png")
    
    # Create the main icon.png (512x512)
    create_icon(512, "icon.png")
    
    print()
    print("✅ All icons generated successfully!")
    print()
    print("Generated files:")
    print("  - icon.png (512x512) - Main icon")
    print(f"  - icons/icon-*.png ({len(sizes)} sizes)")
    print()
    print("Note: electron-builder will automatically generate .ico and .icns")
    print("      files from icon.png during the build process.")
    
    # Try to create ICO for Windows if multiple sizes exist
    try:
        print()
        print("Attempting to create Windows .ico file...")
        
        # Load all icon sizes
        icon_images = []
        for size in [16, 32, 48, 64, 128, 256]:
            try:
                img = Image.open(f"icons/icon-{size}.png")
                icon_images.append(img)
            except:
                pass
        
        if icon_images:
            # Save as ICO
            icon_images[0].save(
                "icon.ico",
                format='ICO',
                sizes=[(img.width, img.height) for img in icon_images]
            )
            print("✅ Created icon.ico for Windows")
        
    except Exception as e:
        print(f"ℹ️  Could not create .ico: {e}")
        print("   electron-builder will handle this automatically.")

if __name__ == "__main__":
    main()
