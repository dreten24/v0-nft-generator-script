#!/usr/bin/env python3
"""
Natural Dogelection: Batch Fractal NFT Generator
Generates 4444 unique fractal NFTs in optimized batches
"""

import numpy as np
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFilter
import random
import math
import os
import json
import sys
from datetime import datetime

class BatchDogelectionGenerator:
    def __init__(self):
        self.base_dir = "scratchpad/natural-dogelection"
        self.output_dir = f"{self.base_dir}/nfts"
        self.metadata_dir = f"{self.base_dir}/metadata"
        
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.metadata_dir, exist_ok=True)
        
        # Era distribution for 4444 NFTs
        self.eras = {
            1: {"name": "Eoarchean", "theme": "Genesis Fractals", "count": 635, "colors": ["#001122", "#003366", "#0066AA", "#C0C0C0"]},
            2: {"name": "Paleoarchean", "theme": "Bacterial Bloom", "count": 635, "colors": ["#004444", "#006666", "#00AAAA", "#66DDDD"]},
            3: {"name": "Mesoarchean", "theme": "Stromatolite Layers", "count": 635, "colors": ["#553311", "#775533", "#AA7755", "#DDAA77"]},
            4: {"name": "Neoarchean", "theme": "Craton Foundation", "count": 635, "colors": ["#444444", "#666666", "#888888", "#AAAAAA"]},
            5: {"name": "Paleozoic", "theme": "Life Explosion", "count": 635, "colors": ["#FF6600", "#FFAA00", "#FFDD00", "#66FF66"]},
            6: {"name": "Mesozoic", "theme": "Dinosaur Reign", "count": 635, "colors": ["#228833", "#44AA55", "#66CC77", "#88EE99"]},
            7: {"name": "Cenozoic", "theme": "Mammalian Rise", "count": 634, "colors": ["#CC6644", "#EE8866", "#FFAA88", "#FFCCAA"]}
        }
        
        self.rarities = ["Legendary", "Epic", "Rare", "Common"]
        self.rarity_weights = [0.05, 0.15, 0.25, 0.55]
    
    def generate_mandelbrot_fractal(self, width=512, height=512, max_iter=80):
        """Optimized Mandelbrot fractal generation"""
        zoom = random.uniform(0.5, 100)
        center_x = random.uniform(-0.8, 0.8)
        center_y = random.uniform(-0.8, 0.8)
        
        x_min, x_max = center_x - 2/zoom, center_x + 2/zoom
        y_min, y_max = center_y - 2/zoom, center_y + 2/zoom
        
        x = np.linspace(x_min, x_max, width)
        y = np.linspace(y_min, y_max, height)
        X, Y = np.meshgrid(x, y)
        C = X + 1j*Y
        
        Z = np.zeros_like(C)
        M = np.zeros(C.shape)
        
        for i in range(max_iter):
            mask = np.abs(Z) <= 2
            Z[mask] = Z[mask]**2 + C[mask]
            M[mask] = i
            
        return M / max_iter
    
    def apply_era_styling(self, fractal_data, era_id, rarity):
        """Apply era-specific colors and effects"""
        height, width = fractal_data.shape
        img = Image.new('RGB', (width, height), 'black')
        
        era = self.eras[era_id]
        colors = era["colors"]
        
        # Convert fractal to colored image
        for y in range(height):
            for x in range(width):
                intensity = fractal_data[y, x]
                color_idx = int(intensity * (len(colors) - 1))
                color_hex = colors[color_idx]
                
                # Convert hex to RGB
                if color_hex == "#C0C0C0":  # Silver
                    rgb = (192, 192, 192)
                else:
                    rgb = tuple(int(color_hex[i:i+2], 16) for i in (1, 3, 5))
                
                img.putpixel((x, y), rgb)
        
        # Add rarity effects
        if rarity == "Legendary":
            img = img.filter(ImageFilter.GaussianBlur(radius=1))
            # Add golden border
            draw = ImageDraw.Draw(img)
            draw.rectangle([0, 0, width-1, height-1], outline=(255, 215, 0), width=5)
        elif rarity == "Epic":
            # Add purple border
            draw = ImageDraw.Draw(img)
            draw.rectangle([0, 0, width-1, height-1], outline=(128, 0, 128), width=3)
        
        return img
    
    def generate_batch(self, era_id, start_id, batch_size):
        """Generate a batch of NFTs for specific era"""
        era = self.eras[era_id]
        print(f"   Generating batch {start_id}-{start_id + batch_size - 1} for {era['name']}")
        
        for i in range(batch_size):
            nft_id = start_id + i
            
            # Generate fractal
            fractal_data = self.generate_mandelbrot_fractal()
            
            # Determine rarity
            rarity = np.random.choice(self.rarities, p=self.rarity_weights)
            
            # Apply styling
            img = self.apply_era_styling(fractal_data, era_id, rarity)
            
            # Save image
            filename = f"natural-dogelection-{nft_id:04d}.png"
            img.save(os.path.join(self.output_dir, filename), optimize=True)
            
            # Generate metadata
            metadata = {
                "name": f"Natural Dogelection #{nft_id}",
                "description": f"Biomimetic fractal NFT representing {era['name']} era. Part of the Natural Dogelection collection - 4444 unique pieces celebrating 4.6 billion years of evolution on the Dogecoin blockchain.",
                "image": f"natural-dogelection-{nft_id:04d}.png",
                "attributes": [
                    {"trait_type": "Era", "value": era["name"]},
                    {"trait_type": "Theme", "value": era["theme"]},
                    {"trait_type": "Rarity", "value": rarity},
                    {"trait_type": "Fractal Type", "value": "Mandelbrot"},
                    {"trait_type": "Generation", "value": "Genesis"},
                    {"trait_type": "Price", "value": "44 DOGE"}
                ]
            }
            
            with open(os.path.join(self.metadata_dir, f"natural-dogelection-{nft_id:04d}.json"), 'w') as f:
                json.dump(metadata, f, indent=2)
    
    def generate_sample_collection(self):
        """Generate representative samples from each era"""
        print("🚀 Generating Natural Dogelection Sample Collection...")
        print("   Demonstrating fractal NFTs across 7 evolutionary eras")
        print("   " + "="*50)
        
        samples_per_era = 7
        nft_id = 1
        
        for era_id in range(1, 8):
            era = self.eras[era_id]
            print(f"\n🌍 Era {era_id}: {era['name']} ({era['theme']})")
            
            self.generate_batch(era_id, nft_id, samples_per_era)
            nft_id += samples_per_era
        
        # Create collection summary
        summary = {
            "project_name": "Natural Dogelection",
            "concept": "Fractal NFTs representing 4.6 billion years of evolution",
            "blockchain": "Dogecoin", 
            "total_planned": 4444,
            "price_per_nft": "44 DOGE",
            "total_value": "195,536 DOGE",
            "sample_generated": nft_id - 1,
            "eras_represented": 7,
            "generation_date": datetime.now().isoformat(),
            "creator": "DeAndre Tention",
            "inspiration": "Original Natural Solection project adapted for Dogecoin"
        }
        
        with open(f"{self.base_dir}/collection-summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n✅ Sample Collection Generated!")
        print(f"   📊 {nft_id-1} sample NFTs created")
        print(f"   🎨 7 evolutionary eras represented")
        print(f"   💎 Multiple rarity tiers")
        print(f"   📁 Saved to: {self.output_dir}")
        print(f"\n💡 Ready to scale to full 4444 collection!")

if __name__ == "__main__":
    generator = BatchDogelectionGenerator()
    generator.generate_sample_collection()
