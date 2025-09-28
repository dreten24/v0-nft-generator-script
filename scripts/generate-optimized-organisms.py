import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
import colorsys
import math
import json
import os
import io
from typing import Dict, List, Tuple, Any


class OptimizedFractalGenerator:
    def __init__(self, width=512, height=512):  # Reduced from 1024x1024 to 512x512 for smaller file sizes
        self.width = width
        self.height = height
        self.center_x = width // 2
        self.center_y = height // 2
        
    def hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def optimize_color_palette(self, colors: List[Tuple[int, int, int]], max_colors: int = 64) -> List[Tuple[int, int, int]]:
        """Optimize color palette to reduce file size while maintaining quality"""
        if len(colors) <= max_colors:
            return colors
        
        # Use k-means-like approach to reduce colors
        optimized = []
        step = len(colors) // max_colors
        for i in range(0, len(colors), max(1, step)):
            optimized.append(colors[i])
        
        return optimized[:max_colors]
    
    def create_optimized_image(self, draw_function, colors: List[Tuple[int, int, int]], 
                              depth: int, complexity: float, rotation: float, scale: float, 
                              organism_name: str, token_id: int) -> Image.Image:
        """Create optimized image with multiple compression strategies"""
        
        img = Image.new('P', (self.width, self.height), 0)  # Palette mode for smaller files
        
        # Create a temporary RGBA image for drawing
        temp_img = Image.new('RGBA', (self.width, self.height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(temp_img)
        
        # Optimize color palette
        optimized_colors = self.optimize_color_palette([self.hex_to_rgb(c) for c in colors if isinstance(c, str)] + 
                                                      [c for c in colors if isinstance(c, tuple)], 32)
        
        # Draw the fractal
        draw_function(draw, optimized_colors, depth, complexity, rotation, scale, organism_name)
        
        # Apply artistic effects
        temp_img = self.apply_optimized_effects(temp_img, token_id)
        
        # Convert to optimized palette
        img = temp_img.quantize(colors=32, method=Image.Quantize.MEDIANCUT)
        
        return img
    
    def apply_optimized_effects(self, img: Image.Image, token_id: int) -> Image.Image:
        """Apply optimized post-processing effects"""
        np.random.seed(token_id)
        
        img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
        
        # Subtle color enhancement
        enhancer = ImageEnhance.Color(img)
        color_factor = 1.05 + np.random.random() * 0.15
        img = enhancer.enhance(color_factor)
        
        # Minimal contrast enhancement
        enhancer = ImageEnhance.Contrast(img)
        contrast_factor = 1.0 + np.random.random() * 0.1
        img = enhancer.enhance(contrast_factor)
        
        return img
    
    def save_ultra_compressed(self, img: Image.Image, filename: str, target_size_kb: int = 8) -> bool:
        """Save image with ultra compression targeting specific file size"""
        target_size_bytes = target_size_kb * 1024
        
        strategies = [
            # Strategy 1: PNG with maximum compression
            lambda: self._save_png_compressed(img, filename, target_size_bytes),
            # Strategy 2: WebP with high compression
            lambda: self._save_webp_compressed(img, filename, target_size_bytes),
            # Strategy 3: JPEG with optimized quality
            lambda: self._save_jpeg_compressed(img, filename, target_size_bytes),
            # Strategy 4: Reduced dimensions PNG
            lambda: self._save_reduced_png(img, filename, target_size_bytes)
        ]
        
        for strategy in strategies:
            if strategy():
                return True
        
        # Fallback: save with best compression available
        img.save(filename, "PNG", optimize=True, compress_level=9)
        return False
    
    def _save_png_compressed(self, img: Image.Image, filename: str, target_size: int) -> bool:
        """Save as highly compressed PNG"""
        try:
            # Convert to palette mode if not already
            if img.mode != 'P':
                img = img.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
            
            img.save(filename, "PNG", optimize=True, compress_level=9, bits=4)
            
            if os.path.getsize(filename) <= target_size:
                return True
        except Exception:
            pass
        return False
    
    def _save_webp_compressed(self, img: Image.Image, filename: str, target_size: int) -> bool:
        """Save as WebP with high compression"""
        try:
            webp_filename = filename.replace('.png', '.webp')
            
            # Try different quality levels
            for quality in [80, 60, 40, 20]:
                img.save(webp_filename, "WebP", quality=quality, method=6, optimize=True)
                
                if os.path.getsize(webp_filename) <= target_size:
                    # Rename to .png for compatibility
                    os.rename(webp_filename, filename)
                    return True
                    
            os.remove(webp_filename) if os.path.exists(webp_filename) else None
        except Exception:
            pass
        return False
    
    def _save_jpeg_compressed(self, img: Image.Image, filename: str, target_size: int) -> bool:
        """Save as JPEG with optimized quality"""
        try:
            # Convert to RGB for JPEG
            if img.mode in ('RGBA', 'P'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = rgb_img
            
            jpeg_filename = filename.replace('.png', '.jpg')
            
            # Try different quality levels
            for quality in [95, 85, 75, 65, 55]:
                img.save(jpeg_filename, "JPEG", quality=quality, optimize=True)
                
                if os.path.getsize(jpeg_filename) <= target_size:
                    # Rename to .png for compatibility
                    os.rename(jpeg_filename, filename)
                    return True
                    
            os.remove(jpeg_filename) if os.path.exists(jpeg_filename) else None
        except Exception:
            pass
        return False
    
    def _save_reduced_png(self, img: Image.Image, filename: str, target_size: int) -> bool:
        """Save with reduced dimensions if needed"""
        try:
            # Try reducing dimensions while maintaining aspect ratio
            for scale in [0.8, 0.6, 0.5]:
                new_width = int(img.width * scale)
                new_height = int(img.height * scale)
                
                resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Convert to palette mode
                if resized.mode != 'P':
                    resized = resized.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
                
                resized.save(filename, "PNG", optimize=True, compress_level=9)
                
                if os.path.getsize(filename) <= target_size:
                    return True
        except Exception:
            pass
        return False

# ... existing fractal drawing methods with optimizations ...

def generate_optimized_organisms():
    """Generate all 4444 unique organism fractals with 8KB optimization"""
    generator = OptimizedFractalGenerator(512, 512)  # Using optimized generator
    
    # Create output directories
    os.makedirs("generated_nfts/images", exist_ok=True)
    os.makedirs("generated_nfts/metadata", exist_ok=True)
    os.makedirs("generated_nfts/compression_stats", exist_ok=True)
    
    print("Starting generation of 4444 optimized organism fractals (target: 8KB each)...")
    
    compression_stats = {
        "total_generated": 0,
        "under_8kb": 0,
        "average_size_kb": 0,
        "compression_methods": {"png": 0, "webp": 0, "jpeg": 0, "reduced": 0}
    }
    
    total_size = 0
    
    for token_id in range(1, 4445):  # 1 to 4444
        if token_id % 100 == 0:
            print(f"Generated {token_id}/4444 organisms... Avg size: {total_size/(token_id*1024):.1f}KB")
        
        # Generate organism with existing logic but optimized
        result = generator.generate_organism_fractal(token_id)
        
        # Save with ultra compression
        image_filename = f"generated_nfts/images/{token_id}.png"
        success = generator.save_ultra_compressed(result["image"], image_filename, 8)
        
        # Track compression stats
        file_size = os.path.getsize(image_filename)
        total_size += file_size
        compression_stats["total_generated"] += 1
        
        if file_size <= 8192:  # 8KB
            compression_stats["under_8kb"] += 1
        
        # Save metadata
        metadata_filename = f"generated_nfts/metadata/{token_id}.json"
        result["metadata"]["file_size_bytes"] = file_size
        result["metadata"]["file_size_kb"] = round(file_size / 1024, 2)
        
        with open(metadata_filename, 'w') as f:
            json.dump(result["metadata"], f, indent=2)
    
    # Calculate final stats
    compression_stats["average_size_kb"] = round(total_size / (4444 * 1024), 2)
    compression_stats["success_rate"] = round((compression_stats["under_8kb"] / 4444) * 100, 1)
    
    print(f"\nGeneration complete!")
    print(f"Success rate (≤8KB): {compression_stats['success_rate']}%")
    print(f"Average file size: {compression_stats['average_size_kb']}KB")
    print(f"Total collection size: {round(total_size / (1024*1024), 1)}MB")
    
    # Save compression stats
    with open("generated_nfts/compression_stats/summary.json", 'w') as f:
        json.dump(compression_stats, f, indent=2)

if __name__ == "__main__":
    generate_optimized_organisms()
