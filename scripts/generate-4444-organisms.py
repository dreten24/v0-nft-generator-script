import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import colorsys
import math
import json
import os
from typing import Dict, List, Tuple, Any

# Geologic era data matching the TypeScript definitions
GEOLOGIC_ERAS = {
    "precambrian": {
        "colors": ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#7209b7"],
        "organisms": ["cyanobacteria", "stromatolite", "acritarch", "dickinsonia"]
    },
    "paleozoic": {
        "colors": ["#2d5016", "#3e6b1f", "#4f7942", "#7ba05b", "#a8c686"],
        "organisms": ["trilobite", "brachiopod", "crinoid", "eurypterid", "dunkleosteus"]
    },
    "mesozoic": {
        "colors": ["#8b4513", "#a0522d", "#cd853f", "#daa520", "#ffd700"],
        "organisms": ["triceratops", "tyrannosaurus", "pteranodon", "ammonite", "plesiosaur"]
    },
    "cenozoic": {
        "colors": ["#228b22", "#32cd32", "#90ee90", "#98fb98", "#f0fff0"],
        "organisms": ["mammoth", "sabertooth", "giant-sloth", "terror-bird", "basilosaurus"]
    },
    "devonian": {
        "colors": ["#4682b4", "#5f9ea0", "#87ceeb", "#b0e0e6", "#e0ffff"],
        "organisms": ["placoderm", "coelacanth", "archaeopteris", "bothrilepis"]
    },
    "carboniferous": {
        "colors": ["#2f4f2f", "#556b2f", "#6b8e23", "#9acd32", "#adff2f"],
        "organisms": ["meganeura", "arthropleura", "lepidodendron", "helicoprion"]
    },
    "permian": {
        "colors": ["#8b0000", "#a52a2a", "#dc143c", "#ff6347", "#ffa500"],
        "organisms": ["dimetrodon", "gorgonopsid", "scutosaurus", "helicoprion"]
    }
}

class AdvancedFractalGenerator:
    def __init__(self, width=1024, height=1024):
        self.width = width
        self.height = height
        self.center_x = width // 2
        self.center_y = height // 2
        
    def hex_to_rgb(self, hex_color: str) -> Tuple[int, int, int]:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def generate_organism_fractal(self, token_id: int) -> Dict[str, Any]:
        """Generate a unique fractal organism based on token ID"""
        # Determine era and organism based on token distribution
        era_names = list(GEOLOGIC_ERAS.keys())
        organisms_per_era = 4444 // len(era_names)
        era_index = min((token_id - 1) // organisms_per_era, len(era_names) - 1)
        era_name = era_names[era_index]
        era_data = GEOLOGIC_ERAS[era_name]
        
        # Use token_id as seed for deterministic generation
        np.random.seed(token_id)
        
        # Select base organism
        organism_name = era_data["organisms"][token_id % len(era_data["organisms"])]
        
        # Generate unique parameters
        fractal_depth = np.random.randint(4, 8)
        complexity = 0.3 + np.random.random() * 0.7
        color_variant = np.random.randint(0, len(era_data["colors"]))
        rotation_factor = np.random.random() * 2 * math.pi
        scale_factor = 0.8 + np.random.random() * 0.4
        
        # Create the fractal image
        img = self.create_artistic_fractal(
            organism_name=organism_name,
            era_colors=era_data["colors"],
            depth=fractal_depth,
            complexity=complexity,
            color_variant=color_variant,
            rotation_factor=rotation_factor,
            scale_factor=scale_factor,
            token_id=token_id
        )
        
        # Generate metadata
        metadata = {
            "tokenId": token_id,
            "name": f"{organism_name.title()} #{token_id}",
            "era": era_name,
            "organism": organism_name,
            "fractalDepth": fractal_depth,
            "complexity": round(complexity, 3),
            "colorVariant": color_variant,
            "rotationFactor": round(rotation_factor, 3),
            "scaleFactor": round(scale_factor, 3)
        }
        
        return {"image": img, "metadata": metadata}
    
    def create_artistic_fractal(self, organism_name: str, era_colors: List[str], 
                              depth: int, complexity: float, color_variant: int,
                              rotation_factor: float, scale_factor: float, token_id: int) -> Image.Image:
        """Create an artistic fractal with organism-specific patterns"""
        
        # Create base image with transparency
        img = Image.new('RGBA', (self.width, self.height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Convert era colors to RGB
        rgb_colors = [self.hex_to_rgb(color) for color in era_colors]
        
        # Create background gradient
        self.create_background_gradient(draw, rgb_colors, color_variant)
        
        # Generate organism-specific fractal pattern
        if organism_name in ["butterfly", "pteranodon", "terror-bird"]:
            self.draw_bilateral_fractal(draw, rgb_colors, depth, complexity, rotation_factor, scale_factor, "wings")
        elif organism_name in ["jellyfish", "crinoid", "meganeura"]:
            self.draw_radial_fractal(draw, rgb_colors, depth, complexity, rotation_factor, scale_factor, "tentacles")
        elif organism_name in ["ammonite", "helicoprion", "cyanobacteria"]:
            self.draw_spiral_fractal(draw, rgb_colors, depth, complexity, rotation_factor, scale_factor, "shell")
        elif organism_name in ["coral", "stromatolite", "lepidodendron", "archaeopteris"]:
            self.draw_branching_fractal(draw, rgb_colors, depth, complexity, rotation_factor, scale_factor, "branches")
        elif organism_name in ["trilobite", "dimetrodon", "mammoth", "tyrannosaurus"]:
            self.draw_segmented_fractal(draw, rgb_colors, depth, complexity, rotation_factor, scale_factor, "segments")
        else:
            # Default crystalline pattern for microscopic/unknown organisms
            self.draw_crystalline_fractal(draw, rgb_colors, depth, complexity, rotation_factor, scale_factor, "crystal")
        
        # Apply post-processing effects
        img = self.apply_artistic_effects(img, token_id)
        
        return img
    
    def create_background_gradient(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], variant: int):
        """Create a subtle background gradient"""
        base_color = colors[variant % len(colors)]
        
        # Create radial gradient
        for r in range(0, self.width // 2, 10):
            alpha = max(5, 30 - r // 20)
            color = base_color + (alpha,)
            draw.ellipse([
                self.center_x - r, self.center_y - r,
                self.center_x + r, self.center_y + r
            ], fill=color)
    
    def draw_bilateral_fractal(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                              depth: int, complexity: float, rotation: float, scale: float, pattern_type: str):
        """Draw bilateral symmetry fractal (wings, bilateral organisms)"""
        def draw_wing_recursive(x, y, size, level, angle, side_multiplier):
            if level <= 0 or size < 8:
                return
            
            alpha = int(255 * (level / depth) * 0.7)
            color = colors[level % len(colors)] + (alpha,)
            
            # Wing shape
            wing_points = []
            for i in range(8):
                t = i / 7
                wing_x = x + side_multiplier * size * (0.8 * math.cos(t * math.pi) + 0.2 * math.cos(3 * t * math.pi))
                wing_y = y + size * 0.6 * math.sin(t * math.pi) * (1 - t * 0.3)
                
                # Apply rotation
                rotated_x = x + (wing_x - x) * math.cos(angle) - (wing_y - y) * math.sin(angle)
                rotated_y = y + (wing_x - x) * math.sin(angle) + (wing_y - y) * math.cos(angle)
                wing_points.extend([rotated_x, rotated_y])
            
            if len(wing_points) >= 6:
                draw.polygon(wing_points, fill=color)
            
            # Recursive calls
            new_size = size * (0.4 + complexity * 0.3)
            positions = [
                (0.7 * side_multiplier, -0.3, angle + 0.3),
                (0.5 * side_multiplier, 0.4, angle - 0.2),
                (0.3 * side_multiplier, -0.6, angle + 0.5)
            ]
            
            for pos_x, pos_y, new_angle in positions:
                new_x = x + pos_x * size
                new_y = y + pos_y * size
                draw_wing_recursive(new_x, new_y, new_size, level - 1, new_angle, side_multiplier)
        
        # Draw both sides
        base_size = min(self.width, self.height) * 0.25 * scale
        draw_wing_recursive(self.center_x, self.center_y, base_size, depth, rotation, 1)  # Right wing
        draw_wing_recursive(self.center_x, self.center_y, base_size, depth, rotation, -1)  # Left wing
    
    def draw_radial_fractal(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                           depth: int, complexity: float, rotation: float, scale: float, pattern_type: str):
        """Draw radial symmetry fractal (jellyfish, sea lilies)"""
        def draw_tentacle_recursive(x, y, size, level, angle):
            if level <= 0 or size < 5:
                return
            
            alpha = int(255 * (level / depth) * 0.8)
            color = colors[level % len(colors)] + (alpha,)
            
            # Tentacle/arm shape
            segments = 12
            tentacle_points = []
            
            for i in range(segments):
                t = i / (segments - 1)
                # Curved tentacle shape
                curve_x = x + size * t * math.cos(angle + t * complexity)
                curve_y = y + size * t * math.sin(angle + t * complexity)
                width = size * 0.1 * (1 - t * 0.7)
                
                # Add width to create tentacle body
                perp_angle = angle + math.pi / 2
                p1_x = curve_x + width * math.cos(perp_angle)
                p1_y = curve_y + width * math.sin(perp_angle)
                p2_x = curve_x - width * math.cos(perp_angle)
                p2_y = curve_y - width * math.sin(perp_angle)
                
                if i == 0:
                    tentacle_points.extend([p1_x, p1_y])
                tentacle_points.extend([p1_x, p1_y])
            
            # Add return path
            for i in range(segments - 1, -1, -1):
                t = i / (segments - 1)
                curve_x = x + size * t * math.cos(angle + t * complexity)
                curve_y = y + size * t * math.sin(angle + t * complexity)
                width = size * 0.1 * (1 - t * 0.7)
                
                perp_angle = angle + math.pi / 2
                p2_x = curve_x - width * math.cos(perp_angle)
                p2_y = curve_y - width * math.sin(perp_angle)
                tentacle_points.extend([p2_x, p2_y])
            
            if len(tentacle_points) >= 6:
                draw.polygon(tentacle_points, fill=color)
            
            # Recursive calls along tentacle
            new_size = size * (0.3 + complexity * 0.2)
            for i in range(2, 4):
                t = i / 4
                new_x = x + size * t * math.cos(angle + t * complexity * 0.5)
                new_y = y + size * t * math.sin(angle + t * complexity * 0.5)
                new_angle = angle + (t - 0.5) * complexity
                draw_tentacle_recursive(new_x, new_y, new_size, level - 1, new_angle)
        
        # Draw radial pattern
        base_size = min(self.width, self.height) * 0.2 * scale
        num_arms = int(6 + complexity * 6)  # 6-12 arms
        
        for i in range(num_arms):
            angle = rotation + (i / num_arms) * 2 * math.pi
            draw_tentacle_recursive(self.center_x, self.center_y, base_size, depth, angle)
    
    def draw_spiral_fractal(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                           depth: int, complexity: float, rotation: float, scale: float, pattern_type: str):
        """Draw spiral fractal (ammonites, shells)"""
        def draw_spiral_recursive(x, y, size, level, start_angle, spiral_tightness):
            if level <= 0 or size < 8:
                return
            
            alpha = int(255 * (level / depth) * 0.9)
            color = colors[level % len(colors)] + (alpha,)
            
            # Draw spiral shell
            points = []
            turns = 2 + complexity * 2
            segments = int(30 * turns)
            
            for i in range(segments):
                t = i / segments
                angle = start_angle + t * turns * 2 * math.pi
                radius = size * (0.1 + t * 0.9) * spiral_tightness
                
                spiral_x = x + radius * math.cos(angle)
                spiral_y = y + radius * math.sin(angle)
                points.extend([spiral_x, spiral_y])
            
            # Draw spiral as thick line
            if len(points) >= 4:
                for i in range(0, len(points) - 2, 2):
                    if i + 3 < len(points):
                        draw.line([points[i], points[i+1], points[i+2], points[i+3]], 
                                 fill=color, width=max(1, int(size * 0.05)))
            
            # Recursive spirals
            new_size = size * (0.35 + complexity * 0.25)
            positions = [
                (0.6, 0, start_angle + math.pi/3),
                (-0.4, 0.3, start_angle - math.pi/4),
                (0.2, -0.5, start_angle + math.pi/2)
            ]
            
            for pos_x, pos_y, new_angle in positions:
                new_x = x + pos_x * size
                new_y = y + pos_y * size
                draw_spiral_recursive(new_x, new_y, new_size, level - 1, new_angle, spiral_tightness * 0.8)
        
        base_size = min(self.width, self.height) * 0.3 * scale
        draw_spiral_recursive(self.center_x, self.center_y, base_size, depth, rotation, 1.0)
    
    def draw_branching_fractal(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                              depth: int, complexity: float, rotation: float, scale: float, pattern_type: str):
        """Draw branching fractal (coral, trees, stromatolites)"""
        def draw_branch_recursive(x, y, size, level, angle, thickness):
            if level <= 0 or size < 10:
                return
            
            alpha = int(255 * (level / depth) * 0.8)
            color = colors[level % len(colors)] + (alpha,)
            
            # Draw main branch
            end_x = x + size * math.cos(angle)
            end_y = y + size * math.sin(angle)
            
            draw.line([x, y, end_x, end_y], fill=color, width=max(1, int(thickness)))
            
            # Draw branch node
            node_size = thickness * 0.8
            draw.ellipse([x - node_size, y - node_size, x + node_size, y + node_size], fill=color)
            
            # Recursive branches
            new_size = size * (0.6 + complexity * 0.2)
            new_thickness = thickness * 0.7
            branch_angles = [
                angle - 0.5 - complexity * 0.3,
                angle + 0.5 + complexity * 0.3,
                angle - 0.2,
                angle + 0.2
            ]
            
            for branch_angle in branch_angles[:int(2 + complexity * 2)]:
                branch_x = x + size * 0.7 * math.cos(angle)
                branch_y = y + size * 0.7 * math.sin(angle)
                draw_branch_recursive(branch_x, branch_y, new_size, level - 1, branch_angle, new_thickness)
        
        base_size = min(self.width, self.height) * 0.25 * scale
        base_thickness = base_size * 0.08
        
        # Multiple main branches
        main_branches = int(3 + complexity * 3)
        for i in range(main_branches):
            branch_angle = rotation + (i / main_branches) * 2 * math.pi
            draw_branch_recursive(self.center_x, self.center_y, base_size, depth, branch_angle, base_thickness)
    
    def draw_segmented_fractal(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                              depth: int, complexity: float, rotation: float, scale: float, pattern_type: str):
        """Draw segmented fractal (trilobites, vertebrates)"""
        def draw_segment_recursive(x, y, size, level, angle, segment_width):
            if level <= 0 or size < 12:
                return
            
            alpha = int(255 * (level / depth) * 0.8)
            color = colors[level % len(colors)] + (alpha,)
            
            # Draw main segment
            segment_length = size * 0.8
            segment_points = []
            
            # Create segmented body shape
            for i in range(8):
                t = i / 7
                seg_x = x + (t - 0.5) * segment_length * math.cos(angle)
                seg_y = y + (t - 0.5) * segment_length * math.sin(angle)
                
                # Add width variation
                width = segment_width * (1 - abs(t - 0.5) * 0.5)
                perp_angle = angle + math.pi / 2
                
                p1_x = seg_x + width * math.cos(perp_angle)
                p1_y = seg_y + width * math.sin(perp_angle)
                segment_points.extend([p1_x, p1_y])
            
            # Add return path
            for i in range(7, -1, -1):
                t = i / 7
                seg_x = x + (t - 0.5) * segment_length * math.cos(angle)
                seg_y = y + (t - 0.5) * segment_length * math.sin(angle)
                
                width = segment_width * (1 - abs(t - 0.5) * 0.5)
                perp_angle = angle + math.pi / 2
                
                p2_x = seg_x - width * math.cos(perp_angle)
                p2_y = seg_y - width * math.sin(perp_angle)
                segment_points.extend([p2_x, p2_y])
            
            if len(segment_points) >= 6:
                draw.polygon(segment_points, fill=color)
            
            # Recursive segments
            new_size = size * (0.4 + complexity * 0.3)
            new_width = segment_width * 0.7
            
            positions = [
                (0.6, 0, angle),
                (-0.6, 0, angle + math.pi),
                (0, 0.5, angle + math.pi/2),
                (0, -0.5, angle - math.pi/2)
            ]
            
            for pos_x, pos_y, new_angle in positions[:int(2 + complexity * 2)]:
                new_x = x + pos_x * size
                new_y = y + pos_y * size
                draw_segment_recursive(new_x, new_y, new_size, level - 1, new_angle, new_width)
        
        base_size = min(self.width, self.height) * 0.2 * scale
        base_width = base_size * 0.3
        draw_segment_recursive(self.center_x, self.center_y, base_size, depth, rotation, base_width)
    
    def draw_crystalline_fractal(self, draw: ImageDraw.Draw, colors: List[Tuple[int, int, int]], 
                                depth: int, complexity: float, rotation: float, scale: float, pattern_type: str):
        """Draw crystalline fractal (microscopic organisms, minerals)"""
        def draw_crystal_recursive(x, y, size, level, angle):
            if level <= 0 or size < 8:
                return
            
            alpha = int(255 * (level / depth) * 0.9)
            color = colors[level % len(colors)] + (alpha,)
            
            # Draw crystal shape (hexagon)
            crystal_points = []
            sides = 6
            for i in range(sides):
                crystal_angle = angle + (i / sides) * 2 * math.pi
                crystal_x = x + size * 0.5 * math.cos(crystal_angle)
                crystal_y = y + size * 0.5 * math.sin(crystal_angle)
                crystal_points.extend([crystal_x, crystal_y])
            
            draw.polygon(crystal_points, fill=color)
            
            # Inner crystal
            inner_points = []
            for i in range(sides):
                crystal_angle = angle + (i / sides) * 2 * math.pi
                crystal_x = x + size * 0.25 * math.cos(crystal_angle)
                crystal_y = y + size * 0.25 * math.sin(crystal_angle)
                inner_points.extend([crystal_x, crystal_y])
            
            inner_color = colors[(level + 1) % len(colors)] + (alpha // 2,)
            draw.polygon(inner_points, fill=inner_color)
            
            # Recursive crystals
            new_size = size * (0.35 + complexity * 0.25)
            for i in range(sides):
                crystal_angle = angle + (i / sides) * 2 * math.pi
                new_x = x + size * 0.8 * math.cos(crystal_angle)
                new_y = y + size * 0.8 * math.sin(crystal_angle)
                new_angle = crystal_angle + complexity
                draw_crystal_recursive(new_x, new_y, new_size, level - 1, new_angle)
        
        base_size = min(self.width, self.height) * 0.2 * scale
        draw_crystal_recursive(self.center_x, self.center_y, base_size, depth, rotation)
    
    def apply_artistic_effects(self, img: Image.Image, token_id: int) -> Image.Image:
        """Apply post-processing effects for artistic quality"""
        # Subtle blur for organic feel
        img = img.filter(ImageFilter.GaussianBlur(radius=0.8))
        
        # Enhance colors based on token_id
        np.random.seed(token_id)
        
        # Color enhancement
        enhancer = ImageEnhance.Color(img)
        color_factor = 1.1 + np.random.random() * 0.3
        img = enhancer.enhance(color_factor)
        
        # Contrast enhancement
        enhancer = ImageEnhance.Contrast(img)
        contrast_factor = 1.0 + np.random.random() * 0.2
        img = enhancer.enhance(contrast_factor)
        
        # Subtle sharpening
        img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=120, threshold=2))
        
        return img

def generate_all_organisms():
    """Generate all 4444 unique organism fractals"""
    generator = AdvancedFractalGenerator()
    
    # Create output directories
    os.makedirs("generated_nfts/images", exist_ok=True)
    os.makedirs("generated_nfts/metadata", exist_ok=True)
    
    print("Starting generation of 4444 unique organism fractals...")
    
    for token_id in range(1, 4445):  # 1 to 4444
        if token_id % 100 == 0:
            print(f"Generated {token_id}/4444 organisms...")
        
        # Generate organism
        result = generator.generate_organism_fractal(token_id)
        
        # Save image
        image_filename = f"generated_nfts/images/{token_id}.png"
        result["image"].save(image_filename, "PNG", optimize=True)
        
        # Save metadata
        metadata_filename = f"generated_nfts/metadata/{token_id}.json"
        with open(metadata_filename, 'w') as f:
            json.dump(result["metadata"], f, indent=2)
    
    print("All 4444 organisms generated successfully!")
    
    # Generate collection metadata
    collection_metadata = {
        "name": "Prehistoric Fractals",
        "description": "4444 unique artistic fractal organisms spanning 7 geologic eras",
        "total_supply": 4444,
        "mint_price_doge": 44,
        "mint_date": "2024-10-01T00:00:00Z"
    }
    
    with open("generated_nfts/collection.json", 'w') as f:
        json.dump(collection_metadata, f, indent=2)

if __name__ == "__main__":
    generate_all_organisms()
