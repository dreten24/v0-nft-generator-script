import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import colorsys
import math

def create_fractal_organism(organism_type, width=1024, height=1024, depth=4, complexity=0.7):
    """
    Generate high-quality fractal organism for avatar use
    """
    # Create image with transparency
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center_x, center_y = width // 2, height // 2
    
    # Color palettes for different organisms
    color_palettes = {
        'butterfly': [(255, 107, 157), (78, 205, 196), (69, 183, 209)],
        'jellyfish': [(155, 89, 182), (52, 152, 219), (26, 188, 156)],
        'octopus': [(231, 76, 60), (243, 156, 18), (230, 126, 34)],
        'seahorse': [(46, 204, 113), (39, 174, 96), (22, 160, 133)],
        'coral': [(255, 118, 117), (253, 121, 168), (253, 203, 110)],
        'fish': [(0, 184, 148), (0, 206, 201), (116, 185, 255)]
    }
    
    colors = color_palettes.get(organism_type, color_palettes['butterfly'])
    
    def draw_organism_recursive(x, y, size, current_depth, rotation=0):
        if current_depth <= 0 or size < 10:
            return
            
        # Calculate alpha based on depth for layering effect
        alpha = int(255 * min(1, current_depth / depth) * 0.8)
        color_index = current_depth % len(colors)
        color = colors[color_index] + (alpha,)
        
        # Draw main organism shape
        if organism_type == 'butterfly':
            draw_butterfly(draw, x, y, size, color, rotation)
        elif organism_type == 'jellyfish':
            draw_jellyfish(draw, x, y, size, color, rotation)
        elif organism_type == 'octopus':
            draw_octopus(draw, x, y, size, color, rotation)
        elif organism_type == 'seahorse':
            draw_seahorse(draw, x, y, size, color, rotation)
        elif organism_type == 'coral':
            draw_coral(draw, x, y, size, color, rotation)
        else:  # fish
            draw_fish(draw, x, y, size, color, rotation)
        
        # Calculate recursive positions
        new_size = size * (0.3 + complexity * 0.2)
        positions = get_recursive_positions(organism_type, size, complexity)
        
        for pos in positions:
            new_x = x + pos['x'] * math.cos(rotation) - pos['y'] * math.sin(rotation)
            new_y = y + pos['x'] * math.sin(rotation) + pos['y'] * math.cos(rotation)
            new_rotation = rotation + pos['rotation']
            
            draw_organism_recursive(new_x, new_y, new_size, current_depth - 1, new_rotation)
    
    # Start recursive drawing
    draw_organism_recursive(center_x, center_y, 300, depth)
    
    # Apply subtle glow effect
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    
    return img

def draw_butterfly(draw, x, y, size, color, rotation):
    # Simplified butterfly shape
    wing_size = size * 0.3
    body_length = size * 0.4
    
    # Body
    draw.ellipse([x - size * 0.02, y - body_length // 2, 
                  x + size * 0.02, y + body_length // 2], fill=color)
    
    # Wings (simplified as ellipses)
    draw.ellipse([x - wing_size, y - wing_size * 0.7, 
                  x - size * 0.05, y + wing_size * 0.3], fill=color)
    draw.ellipse([x + size * 0.05, y - wing_size * 0.7, 
                  x + wing_size, y + wing_size * 0.3], fill=color)

def draw_jellyfish(draw, x, y, size, color, rotation):
    # Bell
    draw.ellipse([x - size * 0.4, y - size * 0.3, 
                  x + size * 0.4, y + size * 0.1], fill=color)
    
    # Tentacles (simplified as lines)
    for i in range(8):
        start_x = x + (i - 3.5) * size * 0.1
        end_x = start_x + size * 0.05
        draw.line([start_x, y + size * 0.1, end_x, y + size * 0.5], 
                  fill=color, width=int(size * 0.02))

def draw_octopus(draw, x, y, size, color, rotation):
    # Head
    draw.ellipse([x - size * 0.3, y - size * 0.25, 
                  x + size * 0.3, y + size * 0.25], fill=color)
    
    # Arms (simplified)
    for i in range(8):
        angle = (i / 8) * 2 * math.pi
        start_x = x + math.cos(angle) * size * 0.2
        start_y = y + math.sin(angle) * size * 0.2
        end_x = x + math.cos(angle) * size * 0.5
        end_y = y + math.sin(angle) * size * 0.5
        draw.line([start_x, start_y, end_x, end_y], 
                  fill=color, width=int(size * 0.03))

def draw_seahorse(draw, x, y, size, color, rotation):
    # Simplified curved body
    points = []
    for i in range(10):
        t = i / 9
        curve_x = x + size * 0.1 * math.sin(t * math.pi)
        curve_y = y - size * 0.4 + t * size * 0.8
        points.extend([curve_x, curve_y])
    
    if len(points) >= 4:
        draw.polygon(points, fill=color)

def draw_coral(draw, x, y, size, color, rotation):
    # Simplified branching structure
    def draw_branch(start_x, start_y, length, angle, branch_depth):
        if branch_depth <= 0:
            return
        
        end_x = start_x + math.cos(angle) * length
        end_y = start_y + math.sin(angle) * length
        
        draw.line([start_x, start_y, end_x, end_y], 
                  fill=color, width=int(size * 0.02))
        
        # Recursive branches
        draw_branch(end_x, end_y, length * 0.7, angle - 0.5, branch_depth - 1)
        draw_branch(end_x, end_y, length * 0.7, angle + 0.5, branch_depth - 1)
    
    draw_branch(x, y + size * 0.3, size * 0.4, -math.pi / 2, 3)

def draw_fish(draw, x, y, size, color, rotation):
    # Body
    draw.ellipse([x - size * 0.3, y - size * 0.2, 
                  x + size * 0.3, y + size * 0.2], fill=color)
    
    # Tail
    tail_points = [x + size * 0.3, y, 
                   x + size * 0.5, y - size * 0.15,
                   x + size * 0.5, y + size * 0.15]
    draw.polygon(tail_points, fill=color)

def get_recursive_positions(organism_type, size, complexity):
    base_distance = size * (0.6 + complexity * 0.4)
    positions = []
    
    if organism_type == 'butterfly':
        positions = [
            {'x': -base_distance * 0.7, 'y': -base_distance * 0.5, 'rotation': -0.3},
            {'x': base_distance * 0.7, 'y': -base_distance * 0.5, 'rotation': 0.3},
            {'x': -base_distance * 0.5, 'y': base_distance * 0.7, 'rotation': -0.5},
            {'x': base_distance * 0.5, 'y': base_distance * 0.7, 'rotation': 0.5}
        ]
    elif organism_type == 'jellyfish':
        for i in range(6):
            angle = (i / 6) * 2 * math.pi
            positions.append({
                'x': math.cos(angle) * base_distance,
                'y': math.sin(angle) * base_distance,
                'rotation': angle
            })
    elif organism_type == 'octopus':
        for i in range(8):
            angle = (i / 8) * 2 * math.pi
            positions.append({
                'x': math.cos(angle) * base_distance,
                'y': math.sin(angle) * base_distance,
                'rotation': angle + math.pi / 2
            })
    else:
        # Default spiral pattern
        for i in range(5):
            angle = (i / 5) * 2 * math.pi
            positions.append({
                'x': math.cos(angle) * base_distance,
                'y': math.sin(angle) * base_distance,
                'rotation': angle
            })
    
    return positions

# Example usage
if __name__ == "__main__":
    organisms = ['butterfly', 'jellyfish', 'octopus', 'seahorse', 'coral', 'fish']
    
    for organism in organisms:
        print(f"Generating {organism} fractal...")
        fractal_img = create_fractal_organism(organism, depth=5, complexity=0.8)
        fractal_img.save(f"fractal_{organism}_avatar.png")
        print(f"Saved fractal_{organism}_avatar.png")
    
    print("All fractal organisms generated successfully!")
