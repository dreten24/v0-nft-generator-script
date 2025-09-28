import json
import numpy as np
from typing import Dict, List, Tuple
import base64

class FractalTo3DConverter:
    """Convert 2D fractal patterns to 3D models for metaverse use"""
    
    def __init__(self):
        self.vertices = []
        self.faces = []
        self.materials = []
        
    def fractal_to_3d(self, fractal_data: Dict) -> Dict:
        """Convert fractal pattern to 3D mesh data"""
        
        # Extract fractal parameters
        pattern = fractal_data.get('fractalPattern', 'spiral')
        complexity = fractal_data.get('complexity', 50) / 100.0
        symmetry = fractal_data.get('symmetry', 'radial')
        
        # Generate 3D vertices based on fractal pattern
        if pattern == 'spiral':
            vertices = self._generate_spiral_3d(complexity)
        elif pattern == 'branching':
            vertices = self._generate_branching_3d(complexity)
        elif pattern == 'crystalline':
            vertices = self._generate_crystalline_3d(complexity)
        else:
            vertices = self._generate_radial_3d(complexity)
        
        # Generate faces (triangulation)
        faces = self._triangulate_vertices(vertices)
        
        # Generate materials
        materials = self._create_pbr_materials(fractal_data)
        
        # Create GLB-compatible structure
        glb_data = {
            'asset': {
                'version': '2.0',
                'generator': 'Prehistoric Fractals 3D Converter'
            },
            'scene': 0,
            'scenes': [{'nodes': [0]}],
            'nodes': [{
                'mesh': 0,
                'name': f"PrehistoricFractal_{fractal_data.get('tokenId', 'unknown')}"
            }],
            'meshes': [{
                'primitives': [{
                    'attributes': {
                        'POSITION': 0,
                        'NORMAL': 1,
                        'TEXCOORD_0': 2
                    },
                    'indices': 3,
                    'material': 0
                }]
            }],
            'materials': materials,
            'accessors': self._create_accessors(vertices, faces),
            'bufferViews': self._create_buffer_views(vertices, faces),
            'buffers': [{'byteLength': len(self._create_binary_data(vertices, faces))}]
        }
        
        return glb_data
    
    def _generate_spiral_3d(self, complexity: float) -> List[Tuple[float, float, float]]:
        """Generate 3D spiral vertices"""
        vertices = []
        num_points = int(1000 * complexity)
        
        for i in range(num_points):
            t = i * 0.1
            radius = 0.1 * np.sqrt(t)
            
            # Golden ratio spiral in 3D
            phi = (1 + np.sqrt(5)) / 2
            x = radius * np.cos(t)
            y = radius * np.sin(t)
            z = t * 0.01  # Height variation
            
            vertices.append((x, y, z))
            
            # Add recursive smaller spirals
            for scale in [0.5, 0.25]:
                if scale > (1 - complexity):
                    sx = x * scale + 0.1 * np.cos(t * phi)
                    sy = y * scale + 0.1 * np.sin(t * phi)
                    sz = z * scale
                    vertices.append((sx, sy, sz))
        
        return vertices
    
    def _generate_branching_3d(self, complexity: float) -> List[Tuple[float, float, float]]:
        """Generate 3D branching structure"""
        vertices = []
        
        def add_branch(start_pos, direction, length, depth):
            if depth <= 0 or length < 0.01:
                return
            
            # Calculate end position
            end_pos = (
                start_pos[0] + direction[0] * length,
                start_pos[1] + direction[1] * length,
                start_pos[2] + direction[2] * length
            )
            
            vertices.extend([start_pos, end_pos])
            
            # Add recursive branches
            for angle_offset in [-0.5, 0.5]:
                new_direction = (
                    direction[0] * np.cos(angle_offset) - direction[1] * np.sin(angle_offset),
                    direction[0] * np.sin(angle_offset) + direction[1] * np.cos(angle_offset),
                    direction[2] + 0.1 * angle_offset
                )
                
                add_branch(end_pos, new_direction, length * 0.7, depth - 1)
        
        # Start with multiple main branches
        for i in range(int(8 * complexity)):
            angle = (2 * np.pi * i) / (8 * complexity)
            direction = (np.cos(angle), np.sin(angle), 0.2)
            add_branch((0, 0, 0), direction, 0.5, int(6 * complexity))
        
        return vertices
    
    def _generate_crystalline_3d(self, complexity: float) -> List[Tuple[float, float, float]]:
        """Generate 3D crystalline structure"""
        vertices = []
        
        # Create hexagonal crystal lattice in 3D
        for layer in range(int(10 * complexity)):
            z = layer * 0.1
            radius = 0.2 + layer * 0.05
            
            for i in range(6):  # Hexagonal
                angle = (2 * np.pi * i) / 6
                x = radius * np.cos(angle)
                y = radius * np.sin(angle)
                
                vertices.append((x, y, z))
                
                # Add recursive smaller crystals
                for scale in [0.5, 0.25]:
                    if scale > (1 - complexity):
                        sx = x * scale
                        sy = y * scale
                        sz = z + scale * 0.1
                        vertices.append((sx, sy, sz))
        
        return vertices
    
    def _generate_radial_3d(self, complexity: float) -> List[Tuple[float, float, float]]:
        """Generate 3D radial pattern"""
        vertices = []
        
        for ring in range(int(20 * complexity)):
            radius = 0.05 + ring * 0.02
            num_points = max(6, int(ring * 2))
            
            for i in range(num_points):
                angle = (2 * np.pi * i) / num_points
                x = radius * np.cos(angle)
                y = radius * np.sin(angle)
                z = 0.01 * ring * np.sin(angle * 3)  # Wave pattern
                
                vertices.append((x, y, z))
        
        return vertices
    
    def _triangulate_vertices(self, vertices: List[Tuple[float, float, float]]) -> List[Tuple[int, int, int]]:
        """Create triangular faces from vertices"""
        faces = []
        
        # Simple triangulation - connect consecutive vertices
        for i in range(0, len(vertices) - 2, 3):
            if i + 2 < len(vertices):
                faces.append((i, i + 1, i + 2))
        
        return faces
    
    def _create_pbr_materials(self, fractal_data: Dict) -> List[Dict]:
        """Create PBR materials for the 3D model"""
        color_scheme = fractal_data.get('colorScheme', 'oceanic')
        
        color_maps = {
            'oceanic': [0.0, 0.3, 0.6, 1.0],
            'volcanic': [0.6, 0.2, 0.0, 1.0],
            'forest': [0.2, 0.6, 0.2, 1.0],
            'desert': [0.8, 0.6, 0.3, 1.0],
            'arctic': [0.8, 0.9, 1.0, 1.0],
            'cosmic': [0.3, 0.1, 0.6, 1.0]
        }
        
        base_color = color_maps.get(color_scheme, color_maps['oceanic'])
        
        material = {
            'name': f'FractalMaterial_{color_scheme}',
            'pbrMetallicRoughness': {
                'baseColorFactor': base_color,
                'metallicFactor': 0.1,
                'roughnessFactor': 0.3
            },
            'emissiveFactor': [base_color[0] * 0.1, base_color[1] * 0.1, base_color[2] * 0.1],
            'alphaMode': 'BLEND'
        }
        
        # Add special effects for certain traits
        if fractal_data.get('fossilEffect'):
            material['pbrMetallicRoughness']['roughnessFactor'] = 0.8
            material['pbrMetallicRoughness']['metallicFactor'] = 0.0
        
        if fractal_data.get('animation'):
            # Add animation data (simplified)
            material['extensions'] = {
                'KHR_materials_emissive_strength': {
                    'emissiveStrength': 2.0
                }
            }
        
        return [material]
    
    def _create_accessors(self, vertices: List, faces: List) -> List[Dict]:
        """Create GLB accessors for vertex data"""
        return [
            {  # POSITION
                'bufferView': 0,
                'componentType': 5126,  # FLOAT
                'count': len(vertices),
                'type': 'VEC3',
                'min': [min(v[i] for v in vertices) for i in range(3)],
                'max': [max(v[i] for v in vertices) for i in range(3)]
            },
            {  # NORMAL (simplified)
                'bufferView': 1,
                'componentType': 5126,
                'count': len(vertices),
                'type': 'VEC3'
            },
            {  # TEXCOORD_0
                'bufferView': 2,
                'componentType': 5126,
                'count': len(vertices),
                'type': 'VEC2'
            },
            {  # INDICES
                'bufferView': 3,
                'componentType': 5123,  # UNSIGNED_SHORT
                'count': len(faces) * 3,
                'type': 'SCALAR'
            }
        ]
    
    def _create_buffer_views(self, vertices: List, faces: List) -> List[Dict]:
        """Create GLB buffer views"""
        return [
            {'buffer': 0, 'byteOffset': 0, 'byteLength': len(vertices) * 12},  # POSITION
            {'buffer': 0, 'byteOffset': len(vertices) * 12, 'byteLength': len(vertices) * 12},  # NORMAL
            {'buffer': 0, 'byteOffset': len(vertices) * 24, 'byteLength': len(vertices) * 8},  # TEXCOORD
            {'buffer': 0, 'byteOffset': len(vertices) * 32, 'byteLength': len(faces) * 6}  # INDICES
        ]
    
    def _create_binary_data(self, vertices: List, faces: List) -> bytes:
        """Create binary buffer data"""
        # This would contain the actual vertex, normal, texture coordinate, and index data
        # Simplified for demonstration
        return b'\x00' * (len(vertices) * 32 + len(faces) * 6)
    
    def export_glb(self, fractal_data: Dict, output_path: str):
        """Export fractal as GLB file"""
        glb_data = self.fractal_to_3d(fractal_data)
        
        # In a real implementation, this would write a proper GLB file
        with open(output_path, 'w') as f:
            json.dump(glb_data, f, indent=2)
        
        print(f"3D model exported to {output_path}")

def generate_3d_collection():
    """Generate 3D models for sample fractals"""
    converter = FractalTo3DConverter()
    
    sample_fractals = [
        {
            'tokenId': 1,
            'fractalPattern': 'spiral',
            'colorScheme': 'oceanic',
            'complexity': 75,
            'symmetry': 'radial',
            'animation': True
        },
        {
            'tokenId': 2,
            'fractalPattern': 'branching',
            'colorScheme': 'forest',
            'complexity': 90,
            'symmetry': 'bilateral',
            'fossilEffect': True
        },
        {
            'tokenId': 3,
            'fractalPattern': 'crystalline',
            'colorScheme': 'arctic',
            'complexity': 60,
            'symmetry': 'rotational'
        }
    ]
    
    for fractal in sample_fractals:
        output_path = f"prehistoric_fractal_{fractal['tokenId']}.glb"
        converter.export_glb(fractal, output_path)
    
    print("3D model generation complete!")

if __name__ == "__main__":
    generate_3d_collection()
