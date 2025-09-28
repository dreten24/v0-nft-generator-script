#!/usr/bin/env python3
"""
Ultra-optimized NFT generation script targeting 8KB file sizes
Maintains artistic quality while achieving maximum compression
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
import colorsys
import math
import json
import os
import io
from typing import Dict, List, Tuple, Any
import time

GEOLOGIC_ERAS = {
    "precambrian": {
        "colors": ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#7209b7"],
        "organisms": ["cyanobacteria", "stromatolite", "acritarch", "dickinsonia", "spriggina", "charnia"],
        "period": "4600-541 MYA",
        "characteristics": "First life forms, microbial mats, soft-bodied organisms"
    },
    "paleozoic": {
        "colors": ["#2d5016", "#3e6b1f", "#4f7942", "#7ba05b", "#a8c686"],
        "organisms": ["trilobite", "brachiopod", "crinoid", "eurypterid", "dunkleosteus", "archaeopteris"],
        "period": "541-252 MYA", 
        "characteristics": "Cambrian explosion, first vertebrates, colonization of land"
    },
    "mesozoic": {
        "colors": ["#8b4513", "#a0522d", "#cd853f", "#daa520", "#ffd700"],
        "organisms": ["triceratops", "tyrannosaurus", "pteranodon", "ammonite", "plesiosaur", "archaeopteryx"],
        "period": "252-66 MYA",
        "characteristics": "Age of reptiles, dinosaurs, first birds and mammals"
    },
    "cenozoic": {
        "colors": ["#228b22", "#32cd32", "#90ee90", "#98fb98", "#f0fff0"],
        "organisms": ["mammoth", "sabertooth", "giant-sloth", "terror-bird", "basilosaurus", "australopithecus"],
        "period": "66 MYA-Present",
        "characteristics": "Age of mammals, human evolution, ice ages"
    },
    "devonian": {
        "colors": ["#4682b4", "#5f9ea0", "#87ceeb", "#b0e0e6", "#e0ffff"],
        "organisms": ["placoderm", "coelacanth", "archaeopteris", "bothrilepis", "acanthostega", "tiktaalik"],
        "period": "419-359 MYA",
        "characteristics": "Age of fishes, first forests, tetrapod evolution"
    },
    "carboniferous": {
        "colors": ["#2f4f2f", "#556b2f", "#6b8e23", "#9acd32", "#adff2f"],
        "organisms": ["meganeura", "arthropleura", "lepidodendron", "helicoprion", "dimetrodon", "eryops"],
        "period": "359-299 MYA",
        "characteristics": "Coal forests, giant insects, early reptiles"
    },
    "permian": {
        "colors": ["#8b0000", "#a52a2a", "#dc143c", "#ff6347", "#ffa500"],
        "organisms": ["dimetrodon", "gorgonopsid", "scutosaurus", "helicoprion", "glossopteris", "lystrosaurus"],
        "period": "299-252 MYA",
        "characteristics": "Supercontinent Pangaea, mass extinction event"
    }
}

class UltraOptimizedFractalGenerator:
    def __init__(self, width=512, height=512):
        self.width = width
        self.height = height
        self.center_x = width // 2
        self.center_y = height // 2
        
    def generate_organism_fractal(self, token_id: int) -> Dict[str, Any]:
        """Generate ultra-optimized fractal organism"""
        # Determine era and organism
        era_names = list(GEOLOGIC_ERAS.keys())
        organisms_per_era = 4444 // len(era_names)
        era_index = min((token_id - 1) // organisms_per_era, len(era_names) - 1)
        era_name = era_names[era_index]
        era_data = GEOLOGIC_ERAS[era_name]
        
        # Deterministic generation
        np.random.seed(token_id)
        
        organism_name = era_data["organisms"][token_id % len(era_data["organisms"])]
        
        # Optimized parameters for smaller file sizes
        fractal_depth = np.random.randint(3, 6)  # Reduced depth
        complexity = 0.4 + np.random.random() * 0.4  # Reduced complexity
        color_variant = np.random.randint(0, len(era_data["colors"]))
        rotation_factor = np.random.random() * 2 * math.pi
        scale_factor = 0.7 + np.random.random() * 0.3  # Smaller scale
        
        # Create optimized image
        img = self.create_ultra_optimized_fractal(
            organism_name=organism_name,
            era_colors=era_data["colors"],
            depth=fractal_depth,
            complexity=complexity,
            color_variant=color_variant,
            rotation_factor=rotation_factor,
            scale_factor=scale_factor,
            token_id=token_id
        )
        
        metadata = {
            "tokenId": token_id,
            "name": f"{organism_name.title()} #{token_id}",
            "era": era_name,
            "organism": organism_name,
            "period": era_data["period"],
            "characteristics": era_data["characteristics"],
            "fractalDepth": fractal_depth,
            "complexity": round(complexity, 3),
            "optimized": True,
            "targetSize": "8KB"
        }
        
        return {"image": img, "metadata": metadata}
    
    def create_ultra_optimized_fractal(self, organism_name: str, era_colors: List[str], 
                                     depth: int, complexity: float, color_variant: int,
                                     rotation_factor: float, scale_factor: float, token_id: int) -> Image.Image:
        """Create ultra-optimized fractal with minimal colors and maximum compression"""
        
        # Start with indexed color mode for smaller files
        img = Image.new('P', (self.width, self.height))
        
        # Create optimized palette (max 16 colors)
        rgb_colors = [self.hex_to_rgb(color) for color in era_colors]
        optimized_palette = self.create_optimized_palette(rgb_colors, 16)
        
        # Set palette
        palette_data = []
        for color in optimized_palette:
            palette_data.extend(color)
        # Pad to 256 colors
        while len(palette_data) < 768:
            palette_data.extend([0, 0, 0])
        
        img.putpalette(palette_data)
        
        # Create temporary RGBA for drawing
        temp_img = Image.new('RGBA', (self.width, self.height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(temp_img)
        
        # Draw simplified fractal patterns
        self.draw_optimized_fractal_pattern(draw, optimized_palette, organism_name, 
                                          depth, complexity, rotation_factor, scale_factor)
        
        # Convert to palette mode
        quantized = temp_img.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
        
        return quantized
    
    def hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convert hex to RGB"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def create_optimized_palette(self, colors: List[Tuple[int, int, int]], max_colors: int) -> List[Tuple[int, int, int]]:
        """Create optimized color palette"""
        if len(colors) <= max_colors:
            # Add gradients between colors
            palette = colors.copy()
            while len(palette) < max_colors and len(colors) > 1:
                for i in range(len(colors) - 1):
                    if len(palette) >= max_colors:
                        break
                    # Interpolate between colors
                    c1, c2 = colors[i], colors[i + 1]
                    mid_color = tuple((c1[j] + c2[j]) // 2 for j in range(3))
                    if mid_color not in palette:
                        palette.append(mid_color)
            return palette[:max_colors]
        
        # Reduce colors using simple sampling
        step = len(colors) // max_colors
        return colors[::max(1, step)][:max_colors]
    
    def draw_optimized_fractal_pattern(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                                     organism_name: str, depth: int, complexity: float, 
                                     rotation: float, scale: float):
        """Draw simplified fractal patterns optimized for file size"""
        
        # Simplified pattern selection
        if organism_name in ["butterfly", "pteranodon", "archaeopteryx"]:
            self.draw_simple_bilateral(draw, colors, depth, complexity, rotation, scale)
        elif organism_name in ["ammonite", "cyanobacteria", "stromatolite"]:
            self.draw_simple_spiral(draw, colors, depth, complexity, rotation, scale)
        elif organism_name in ["trilobite", "dimetrodon", "mammoth"]:
            self.draw_simple_segmented(draw, colors, depth, complexity, rotation, scale)
        else:
            self.draw_simple_radial(draw, colors, depth, complexity, rotation, scale)
    
    def draw_simple_bilateral(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                            depth: int, complexity: float, rotation: float, scale: float):
        """Simplified bilateral pattern"""
        def draw_wing(x, y, size, level, side):
            if level <= 0 or size < 10:
                return
            
            color = colors[level % len(colors)]
            
            # Simple wing shape
            points = []
            for i in range(6):
                angle = (i / 5) * math.pi
                wing_x = x + side * size * 0.8 * math.cos(angle) * (1 - i * 0.1)
                wing_y = y + size * 0.6 * math.sin(angle)
                points.extend([wing_x, wing_y])
            
            if len(points) >= 6:
                draw.polygon(points, fill=color)
            
            # Recursive wings
            if level > 1:
                new_size = size * 0.5
                draw_wing(x + side * size * 0.4, y - size * 0.2, new_size, level - 1, side)
        
        base_size = min(self.width, self.height) * 0.2 * scale
        draw_wing(self.center_x, self.center_y, base_size, depth, 1)
        draw_wing(self.center_x, self.center_y, base_size, depth, -1)
    
    def draw_simple_spiral(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                         depth: int, complexity: float, rotation: float, scale: float):
        """Simplified spiral pattern"""
        color = colors[0]
        
        # Simple spiral
        points = []
        turns = 2
        segments = 20
        
        for i in range(segments):
            t = i / segments
            angle = rotation + t * turns * 2 * math.pi
            radius = scale * min(self.width, self.height) * 0.15 * t
            
            x = self.center_x + radius * math.cos(angle)
            y = self.center_y + radius * math.sin(angle)
            points.extend([x, y])
        
        # Draw as connected lines
        for i in range(0, len(points) - 2, 2):
            if i + 3 < len(points):
                draw.line([points[i], points[i+1], points[i+2], points[i+3]], 
                         fill=color, width=3)
    
    def draw_simple_segmented(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                            depth: int, complexity: float, rotation: float, scale: float):
        """Simplified segmented pattern"""
        base_size = min(self.width, self.height) * 0.15 * scale
        
        for i in range(depth):
            color = colors[i % len(colors)]
            size = base_size * (1 - i * 0.2)
            
            # Simple ellipse segments
            x = self.center_x + i * size * 0.3 * math.cos(rotation)
            y = self.center_y + i * size * 0.3 * math.sin(rotation)
            
            draw.ellipse([x - size, y - size//2, x + size, y + size//2], fill=color)
    
    def draw_simple_radial(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                         depth: int, complexity: float, rotation: float, scale: float):
        """Simplified radial pattern"""
        base_size = min(self.width, self.height) * 0.1 * scale
        arms = 6
        
        for i in range(arms):
            angle = rotation + (i / arms) * 2 * math.pi
            color = colors[i % len(colors)]
            
            # Simple arm
            end_x = self.center_x + base_size * 2 * math.cos(angle)
            end_y = self.center_y + base_size * 2 * math.sin(angle)
            
            draw.line([self.center_x, self.center_y, end_x, end_y], fill=color, width=4)
            draw.ellipse([end_x - base_size//2, end_y - base_size//2, 
                         end_x + base_size//2, end_y + base_size//2], fill=color)

def save_ultra_compressed(img: Image.Image, filename: str, target_kb: int = 8) -> Dict[str, Any]:
    """Save with ultra compression targeting specific file size"""
    target_bytes = target_kb * 1024
    
    # Strategy 1: PNG with maximum compression
    img.save(filename, "PNG", optimize=True, compress_level=9)
    size = os.path.getsize(filename)
    
    if size <= target_bytes:
        return {"success": True, "method": "PNG", "size_kb": round(size/1024, 2)}
    
    # Strategy 2: Reduce colors further
    if img.mode != 'P':
        img = img.quantize(colors=8, method=Image.Quantize.MEDIANCUT)
    
    img.save(filename, "PNG", optimize=True, compress_level=9)
    size = os.path.getsize(filename)
    
    if size <= target_bytes:
        return {"success": True, "method": "PNG-8", "size_kb": round(size/1024, 2)}
    
    # Strategy 3: Reduce dimensions
    new_width = int(img.width * 0.8)
    new_height = int(img.height * 0.8)
    resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    resized.save(filename, "PNG", optimize=True, compress_level=9)
    size = os.path.getsize(filename)
    
    return {"success": size <= target_bytes, "method": "PNG-Resized", "size_kb": round(size/1024, 2)}

def generate_all_optimized():
    """Generate all 4444 ultra-optimized organisms"""
    generator = UltraOptimizedFractalGenerator()
    
    os.makedirs("generated_nfts/images", exist_ok=True)
    os.makedirs("generated_nfts/metadata", exist_ok=True)
    
    print("🚀 Starting ultra-optimized generation (Target: 8KB per image)")
    print("=" * 60)
    
    stats = {
        "total": 4444,
        "under_8kb": 0,
        "total_size_mb": 0,
        "methods": {"PNG": 0, "PNG-8": 0, "PNG-Resized": 0},
        "average_size_kb": 0
    }
    
    start_time = time.time()
    
    for token_id in range(1, 4445):
        if token_id % 200 == 0:
            elapsed = time.time() - start_time
            rate = token_id / elapsed
            eta = (4444 - token_id) / rate / 60
            print(f"Progress: {token_id}/4444 ({token_id/4444*100:.1f}%) | "
                  f"Rate: {rate:.1f}/sec | ETA: {eta:.1f}min")
        
        # Generate organism
        result = generator.generate_organism_fractal(token_id)
        
        # Save with ultra compression
        image_filename = f"generated_nfts/images/{token_id}.png"
        compression_result = save_ultra_compressed(result["image"], image_filename, 8)
        
        # Update stats
        file_size = os.path.getsize(image_filename)
        stats["total_size_mb"] += file_size / (1024 * 1024)
        
        if compression_result["success"]:
            stats["under_8kb"] += 1
        
        stats["methods"][compression_result["method"]] += 1
        
        # Save metadata
        metadata_filename = f"generated_nfts/metadata/{token_id}.json"
        result["metadata"]["compression"] = compression_result
        
        with open(metadata_filename, 'w') as f:
            json.dump(result["metadata"], f, indent=2)
    
    # Final statistics
    stats["average_size_kb"] = round((stats["total_size_mb"] * 1024) / 4444, 2)
    stats["success_rate"] = round((stats["under_8kb"] / 4444) * 100, 1)
    
    print("\n" + "=" * 60)
    print("🎉 GENERATION COMPLETE!")
    print(f"✅ Success Rate: {stats['success_rate']}% ({stats['under_8kb']}/4444 under 8KB)")
    print(f"📊 Average Size: {stats['average_size_kb']}KB")
    print(f"💾 Total Collection: {stats['total_size_mb']:.1f}MB")
    print(f"⚡ Generation Time: {(time.time() - start_time)/60:.1f} minutes")
    print("\nCompression Methods:")
    for method, count in stats["methods"].items():
        print(f"  {method}: {count} images ({count/4444*100:.1f}%)")
    
    # Save final stats
    with open("generated_nfts/optimization_report.json", 'w') as f:
        json.dump(stats, f, indent=2)

if __name__ == "__main__":
    generate_all_optimized()
