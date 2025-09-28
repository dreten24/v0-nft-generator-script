import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import random
import math
import json
from typing import Dict, List, Tuple, Optional

class AdvancedFractalGenerator:
    def __init__(self):
        self.width = 1024
        self.height = 1024
        self.center = (self.width // 2, self.height // 2)
        
    def generate_advanced_fractal(self, traits: Dict) -> Image.Image:
        """Generate fractal with advanced traits"""
        
        # Create base image
        img = Image.new('RGBA', (self.width, self.height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Apply fractal pattern
        if traits['fractalPattern'] == 'spiral':
            img = self._generate_spiral_fractal(img, traits)
        elif traits['fractalPattern'] == 'branching':
            img = self._generate_branching_fractal(img, traits)
        elif traits['fractalPattern'] == 'crystalline':
            img = self._generate_crystalline_fractal(img, traits)
        elif traits['fractalPattern'] == 'ultra-complex':
            img = self._generate_ultra_complex_fractal(img, traits)
        else:
            img = self._generate_radial_fractal(img, traits)
        
        # Apply color scheme
        img = self._apply_color_scheme(img, traits['colorScheme'])
        
        # Apply texture
        img = self._apply_texture(img, traits['texture'])
        
        # Apply fossil effect if enabled
        if traits.get('fossilEffect', False):
            img = self._apply_fossil_effect(img)
        
        # Apply hybrid era mixing if enabled
        if traits.get('hybridEra'):
            img = self._apply_hybrid_effect(img, traits['hybridEra'])
        
        return img
    
    def _generate_spiral_fractal(self, img: Image.Image, traits: Dict) -> Image.Image:
        """Generate spiral-based fractal pattern"""
        draw = ImageDraw.Draw(img)
        complexity = traits['complexity'] / 100.0
        
        # Golden ratio spiral
        phi = (1 + math.sqrt(5)) / 2
        
        for i in range(int(500 * complexity)):
            angle = i * 0.1
            radius = 5 * math.sqrt(i)
            
            if radius > self.width // 2:
                break
                
            x = self.center[0] + radius * math.cos(angle)
            y = self.center[1] + radius * math.sin(angle)
            
            # Draw recursive spiral elements
            for scale in [1.0, 0.5, 0.25, 0.125]:
                if scale < complexity:
                    size = int(10 * scale)
                    alpha = int(255 * scale * 0.8)
                    color = (255, 255, 255, alpha)
                    
                    draw.ellipse([
                        x - size, y - size,
                        x + size, y + size
                    ], fill=color)
        
        return img
    
    def _generate_branching_fractal(self, img: Image.Image, traits: Dict) -> Image.Image:
        """Generate branching fractal pattern"""
        draw = ImageDraw.Draw(img)
        complexity = traits['complexity'] / 100.0
        
        def draw_branch(x, y, angle, length, depth):
            if depth <= 0 or length < 2:
                return
            
            end_x = x + length * math.cos(angle)
            end_y = y + length * math.sin(angle)
            
            alpha = int(255 * (depth / (complexity * 10)))
            width = max(1, int(depth * 0.5))
            
            # Draw main branch
            draw.line([(x, y), (end_x, end_y)], 
                     fill=(255, 255, 255, alpha), width=width)
            
            # Recursive branches
            new_length = length * 0.7
            draw_branch(end_x, end_y, angle - 0.5, new_length, depth - 1)
            draw_branch(end_x, end_y, angle + 0.5, new_length, depth - 1)
        
        # Start multiple branches from center
        for i in range(int(8 * complexity)):
            angle = (2 * math.pi * i) / (8 * complexity)
            draw_branch(self.center[0], self.center[1], angle, 
                       100 * complexity, int(8 * complexity))
        
        return img
    
    def _generate_crystalline_fractal(self, img: Image.Image, traits: Dict) -> Image.Image:
        """Generate crystalline fractal pattern"""
        draw = ImageDraw.Draw(img)
        complexity = traits['complexity'] / 100.0
        
        # Generate crystal lattice
        for layer in range(int(10 * complexity)):
            radius = 50 + layer * 30
            sides = 6  # Hexagonal crystals
            
            for i in range(sides):
                angle1 = (2 * math.pi * i) / sides
                angle2 = (2 * math.pi * (i + 1)) / sides
                
                x1 = self.center[0] + radius * math.cos(angle1)
                y1 = self.center[1] + radius * math.sin(angle1)
                x2 = self.center[0] + radius * math.cos(angle2)
                y2 = self.center[1] + radius * math.sin(angle2)
                
                alpha = int(255 * (1 - layer / (10 * complexity)))
                draw.line([(x1, y1), (x2, y2)], 
                         fill=(255, 255, 255, alpha), width=2)
                
                # Add recursive smaller crystals
                for scale in [0.5, 0.25]:
                    if scale > (1 - complexity):
                        small_radius = radius * scale
                        sx1 = self.center[0] + small_radius * math.cos(angle1)
                        sy1 = self.center[1] + small_radius * math.sin(angle1)
                        sx2 = self.center[0] + small_radius * math.cos(angle2)
                        sy2 = self.center[1] + small_radius * math.sin(angle2)
                        
                        draw.line([(sx1, sy1), (sx2, sy2)], 
                                 fill=(255, 255, 255, alpha // 2), width=1)
        
        return img
    
    def _generate_ultra_complex_fractal(self, img: Image.Image, traits: Dict) -> Image.Image:
        """Generate ultra-complex fractal combining multiple patterns"""
        # Combine spiral, branching, and crystalline
        img = self._generate_spiral_fractal(img, traits)
        
        # Overlay branching pattern
        branch_img = Image.new('RGBA', (self.width, self.height), (0, 0, 0, 0))
        branch_img = self._generate_branching_fractal(branch_img, traits)
        img = Image.alpha_composite(img, branch_img)
        
        # Add crystalline overlay
        crystal_img = Image.new('RGBA', (self.width, self.height), (0, 0, 0, 0))
        crystal_img = self._generate_crystalline_fractal(crystal_img, traits)
        crystal_img.putalpha(128)  # Semi-transparent
        img = Image.alpha_composite(img, crystal_img)
        
        return img
    
    def _apply_color_scheme(self, img: Image.Image, scheme: str) -> Image.Image:
        """Apply color scheme to the fractal"""
        color_maps = {
            'oceanic': [(0, 50, 100), (0, 100, 150), (50, 150, 200)],
            'volcanic': [(100, 0, 0), (150, 50, 0), (200, 100, 50)],
            'forest': [(0, 100, 0), (50, 150, 50), (100, 200, 100)],
            'desert': [(150, 100, 50), (200, 150, 100), (250, 200, 150)],
            'arctic': [(200, 220, 255), (150, 180, 220), (100, 140, 180)],
            'cosmic': [(50, 0, 100), (100, 50, 150), (150, 100, 200)],
            'sepia': [(139, 69, 19), (160, 82, 45), (205, 133, 63)],
            'monochrome': [(100, 100, 100), (150, 150, 150), (200, 200, 200)]
        }
        
        colors = color_maps.get(scheme, color_maps['oceanic'])
        
        # Apply color mapping
        pixels = img.load()
        for y in range(img.height):
            for x in range(img.width):
                r, g, b, a = pixels[x, y]
                if a > 0:  # Only modify non-transparent pixels
                    # Map grayscale to color scheme
                    intensity = (r + g + b) // 3
                    color_index = min(len(colors) - 1, intensity // (256 // len(colors)))
                    new_color = colors[color_index]
                    pixels[x, y] = (*new_color, a)
        
        return img
    
    def _apply_texture(self, img: Image.Image, texture: str) -> Image.Image:
        """Apply texture effects"""
        if texture == 'rough':
            # Add noise
            noise = Image.effect_noise(img.size, 0.1)
            img = Image.blend(img.convert('RGB'), noise, 0.1).convert('RGBA')
        elif texture == 'crystalline':
            # Sharpen edges
            img = img.filter(ImageFilter.SHARPEN)
        elif texture == 'organic':
            # Slight blur for organic feel
            img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
        elif texture == 'metallic':
            # Enhance contrast
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(1.5)
        elif texture == 'ethereal':
            # Soft glow effect
            img = img.filter(ImageFilter.GaussianBlur(radius=1))
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(1.2)
        
        return img
    
    def _apply_fossil_effect(self, img: Image.Image) -> Image.Image:
        """Apply fossil/weathered effect"""
        # Convert to sepia-like colors
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(0.3)  # Desaturate
        
        # Add aging texture
        aged = img.filter(ImageFilter.EMBOSS)
        img = Image.blend(img.convert('RGB'), aged, 0.2).convert('RGBA')
        
        # Reduce overall brightness
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(0.8)
        
        return img
    
    def _apply_hybrid_effect(self, img: Image.Image, hybrid_type: str) -> Image.Image:
        """Apply cross-era hybrid effects"""
        if hybrid_type == 'mixed':
            # Add multiple era characteristics
            # Simulate mixing by adding varied patterns
            overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            
            # Add random era-mixing elements
            for i in range(50):
                x = random.randint(0, img.width)
                y = random.randint(0, img.height)
                size = random.randint(5, 20)
                alpha = random.randint(30, 100)
                
                color = (
                    random.randint(100, 255),
                    random.randint(100, 255),
                    random.randint(100, 255),
                    alpha
                )
                
                draw.ellipse([x-size, y-size, x+size, y+size], fill=color)
            
            img = Image.alpha_composite(img, overlay)
        
        return img
    
    def create_animated_frames(self, traits: Dict, num_frames: int = 30) -> List[Image.Image]:
        """Create frames for animated fractals"""
        frames = []
        
        for frame in range(num_frames):
            # Modify traits slightly for each frame
            frame_traits = traits.copy()
            
            # Add rotation or zoom animation
            rotation_factor = (frame / num_frames) * 2 * math.pi
            frame_traits['rotation'] = rotation_factor
            
            # Generate frame
            frame_img = self.generate_advanced_fractal(frame_traits)
            
            # Apply rotation if animated
            if traits.get('animation', False):
                angle = rotation_factor * 180 / math.pi
                frame_img = frame_img.rotate(angle, center=self.center)
            
            frames.append(frame_img)
        
        return frames

def generate_advanced_collection():
    """Generate collection with advanced features"""
    generator = AdvancedFractalGenerator()
    
    # Example advanced traits
    advanced_traits = [
        {
            'fractalPattern': 'spiral',
            'colorScheme': 'oceanic',
            'complexity': 75,
            'symmetry': 'radial',
            'texture': 'smooth',
            'animation': False,
            'fossilEffect': False
        },
        {
            'fractalPattern': 'branching',
            'colorScheme': 'forest',
            'complexity': 90,
            'symmetry': 'bilateral',
            'texture': 'organic',
            'animation': True,
            'fossilEffect': False
        },
        {
            'fractalPattern': 'crystalline',
            'colorScheme': 'arctic',
            'complexity': 60,
            'symmetry': 'rotational',
            'texture': 'crystalline',
            'animation': False,
            'fossilEffect': True
        },
        {
            'fractalPattern': 'ultra-complex',
            'colorScheme': 'cosmic',
            'complexity': 100,
            'symmetry': 'fractal',
            'texture': 'ethereal',
            'animation': True,
            'fossilEffect': True,
            'hybridEra': 'mixed'
        }
    ]
    
    for i, traits in enumerate(advanced_traits):
        print(f"Generating advanced fractal {i+1}/4...")
        
        if traits.get('animation', False):
            # Generate animated GIF
            frames = generator.create_animated_frames(traits)
            frames[0].save(
                f'advanced_fractal_{i+1}_animated.gif',
                save_all=True,
                append_images=frames[1:],
                duration=100,
                loop=0,
                optimize=True
            )
        else:
            # Generate static image
            img = generator.generate_advanced_fractal(traits)
            img.save(f'advanced_fractal_{i+1}.png', optimize=True)
        
        # Save traits metadata
        with open(f'advanced_fractal_{i+1}_traits.json', 'w') as f:
            json.dump(traits, f, indent=2)
    
    print("Advanced fractal generation complete!")

if __name__ == "__main__":
    generate_advanced_collection()
