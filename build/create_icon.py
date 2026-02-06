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
    """Create a square icon with NeuroInsight branding"""
    
    # Create image with navy blue background
    img = Image.new('RGB', (size, size), NAVY_BLUE)
    draw = ImageDraw.Draw(img)
    
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
    
    # Draw "NeuroInsight" text
    text_y_start = size // 2 + size // 20
    
    # "Neuro" text
    text1 = "Neuro"
    bbox1 = draw.textbbox((0, 0), text1, font=font)
    text1_width = bbox1[2] - bbox1[0]
    text1_x = (size - text1_width) // 2
    draw.text((text1_x, text_y_start), text1, fill=WHITE, font=font)
    
    # "Insight" text
    text2 = "Insight"
    bbox2 = draw.textbbox((0, 0), text2, font=font)
    text2_width = bbox2[2] - bbox2[0]
    text2_height = bbox2[3] - bbox2[1]
    text2_x = (size - text2_width) // 2
    text2_y = text_y_start + text2_height + size // 40
    draw.text((text2_x, text2_y), text2, fill=WHITE, font=font)
    
    # Save the image
    img.save(output_path, 'PNG')
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
