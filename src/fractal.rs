use image::{ImageBuffer, Rgb, RgbImage};
use rand::Rng;
use std::f64::consts::PI;

#[derive(Debug, Clone)]
pub struct FractalConfig {
    pub fractal_type: FractalType,
    pub color_scheme: ColorScheme,
    pub iterations: u32,
    pub zoom: f64,
    pub offset_x: f64,
    pub offset_y: f64,
    pub rotation: f64,
    pub complexity: f64,
}

#[derive(Debug, Clone, Copy)]
pub enum FractalType {
    Mandelbrot,
    Julia,
    BurningShip,
    Phoenix,
}

#[derive(Debug, Clone)]
pub struct ColorScheme {
    pub name: String,
    pub colors: Vec<[u8; 3]>,
    pub gradient_type: GradientType,
}

#[derive(Debug, Clone, Copy)]
pub enum GradientType {
    Linear,
    Radial,
    Spiral,
    Wave,
}

impl FractalConfig {
    pub fn random<R: Rng>(rng: &mut R) -> Self {
        let fractal_types = [
            FractalType::Mandelbrot,
            FractalType::Julia,
            FractalType::BurningShip,
            FractalType::Phoenix,
        ];
        
        let color_schemes = Self::get_color_schemes();
        
        Self {
            fractal_type: fractal_types[rng.gen_range(0..fractal_types.len())],
            color_scheme: color_schemes[rng.gen_range(0..color_schemes.len())].clone(),
            iterations: rng.gen_range(50..200),
            zoom: rng.gen_range(0.5..4.0),
            offset_x: rng.gen_range(-2.0..2.0),
            offset_y: rng.gen_range(-2.0..2.0),
            rotation: rng.gen_range(0.0..2.0 * PI),
            complexity: rng.gen_range(0.1..2.0),
        }
    }
    
    fn get_color_schemes() -> Vec<ColorScheme> {
        vec![
            ColorScheme {
                name: "Cosmic Purple".to_string(),
                colors: vec![[25, 25, 112], [138, 43, 226], [255, 20, 147], [255, 215, 0]],
                gradient_type: GradientType::Radial,
            },
            ColorScheme {
                name: "Ocean Depths".to_string(),
                colors: vec![[0, 20, 40], [0, 100, 150], [0, 191, 255], [135, 206, 235]],
                gradient_type: GradientType::Linear,
            },
            ColorScheme {
                name: "Fire Storm".to_string(),
                colors: vec![[139, 0, 0], [255, 69, 0], [255, 140, 0], [255, 255, 0]],
                gradient_type: GradientType::Spiral,
            },
            ColorScheme {
                name: "Forest Mystique".to_string(),
                colors: vec![[0, 50, 0], [34, 139, 34], [50, 205, 50], [144, 238, 144]],
                gradient_type: GradientType::Wave,
            },
            ColorScheme {
                name: "Arctic Aurora".to_string(),
                colors: vec![[25, 25, 112], [0, 255, 127], [64, 224, 208], [240, 248, 255]],
                gradient_type: GradientType::Radial,
            },
            ColorScheme {
                name: "Sunset Blaze".to_string(),
                colors: vec![[75, 0, 130], [255, 20, 147], [255, 165, 0], [255, 255, 224]],
                gradient_type: GradientType::Linear,
            },
            ColorScheme {
                name: "Neon Dreams".to_string(),
                colors: vec![[0, 0, 0], [255, 0, 255], [0, 255, 255], [255, 255, 255]],
                gradient_type: GradientType::Spiral,
            },
            ColorScheme {
                name: "Golden Horizon".to_string(),
                colors: vec![[139, 69, 19], [218, 165, 32], [255, 215, 0], [255, 248, 220]],
                gradient_type: GradientType::Wave,
            },
        ]
    }
}

pub struct FractalGenerator;

impl FractalGenerator {
    pub fn generate(config: &FractalConfig, width: u32, height: u32) -> RgbImage {
        let mut img = ImageBuffer::new(width, height);
        
        let center_x = width as f64 / 2.0;
        let center_y = height as f64 / 2.0;
        let scale = 4.0 / (width.min(height) as f64 * config.zoom);
        
        for (x, y, pixel) in img.enumerate_pixels_mut() {
            let mut real = (x as f64 - center_x) * scale + config.offset_x;
            let mut imag = (y as f64 - center_y) * scale + config.offset_y;
            
            // Apply rotation
            if config.rotation != 0.0 {
                let cos_r = config.rotation.cos();
                let sin_r = config.rotation.sin();
                let new_real = real * cos_r - imag * sin_r;
                let new_imag = real * sin_r + imag * cos_r;
                real = new_real;
                imag = new_imag;
            }
            
            let iterations = Self::calculate_fractal(config.fractal_type, real, imag, config.iterations, config.complexity);
            let color = Self::get_color(&config.color_scheme, iterations, config.iterations, x, y, width, height);
            *pixel = Rgb(color);
        }
        
        img
    }
    
    fn calculate_fractal(fractal_type: FractalType, x: f64, y: f64, max_iter: u32, complexity: f64) -> u32 {
        match fractal_type {
            FractalType::Mandelbrot => Self::mandelbrot(x, y, max_iter),
            FractalType::Julia => Self::julia(x, y, max_iter, complexity),
            FractalType::BurningShip => Self::burning_ship(x, y, max_iter),
            FractalType::Phoenix => Self::phoenix(x, y, max_iter, complexity),
        }
    }
    
    fn mandelbrot(cx: f64, cy: f64, max_iter: u32) -> u32 {
        let mut x = 0.0;
        let mut y = 0.0;
        let mut iter = 0;
        
        while x * x + y * y <= 4.0 && iter < max_iter {
            let temp = x * x - y * y + cx;
            y = 2.0 * x * y + cy;
            x = temp;
            iter += 1;
        }
        
        iter
    }
    
    fn julia(x: f64, y: f64, max_iter: u32, complexity: f64) -> u32 {
        let cx = -0.7 + complexity * 0.3;
        let cy = 0.27015 + complexity * 0.1;
        let mut zx = x;
        let mut zy = y;
        let mut iter = 0;
        
        while zx * zx + zy * zy <= 4.0 && iter < max_iter {
            let temp = zx * zx - zy * zy + cx;
            zy = 2.0 * zx * zy + cy;
            zx = temp;
            iter += 1;
        }
        
        iter
    }
    
    fn burning_ship(cx: f64, cy: f64, max_iter: u32) -> u32 {
        let mut x = 0.0;
        let mut y = 0.0;
        let mut iter = 0;
        
        while x * x + y * y <= 4.0 && iter < max_iter {
            let temp = x * x - y * y + cx;
            y = 2.0 * x.abs() * y.abs() + cy;
            x = temp;
            iter += 1;
        }
        
        iter
    }
    
    fn phoenix(cx: f64, cy: f64, max_iter: u32, complexity: f64) -> u32 {
        let mut x = 0.0;
        let mut y = 0.0;
        let mut prev_x = 0.0;
        let mut iter = 0;
        let c = 0.5667 + complexity * 0.2;
        
        while x * x + y * y <= 4.0 && iter < max_iter {
            let temp = x * x - y * y + cx + c * prev_x;
            prev_x = x;
            y = 2.0 * x * y + cy;
            x = temp;
            iter += 1;
        }
        
        iter
    }
    
    fn get_color(scheme: &ColorScheme, iterations: u32, max_iter: u32, x: u32, y: u32, width: u32, height: u32) -> [u8; 3] {
        if iterations >= max_iter {
            return [0, 0, 0]; // Black for points in the set
        }
        
        let t = iterations as f64 / max_iter as f64;
        let color_count = scheme.colors.len();
        
        // Apply gradient type effects
        let modified_t = match scheme.gradient_type {
            GradientType::Linear => t,
            GradientType::Radial => {
                let center_x = width as f64 / 2.0;
                let center_y = height as f64 / 2.0;
                let distance = ((x as f64 - center_x).powi(2) + (y as f64 - center_y).powi(2)).sqrt();
                let max_distance = (center_x.powi(2) + center_y.powi(2)).sqrt();
                t * (1.0 + 0.5 * (distance / max_distance))
            },
            GradientType::Spiral => {
                let center_x = width as f64 / 2.0;
                let center_y = height as f64 / 2.0;
                let angle = ((y as f64 - center_y).atan2(x as f64 - center_x) + PI) / (2.0 * PI);
                (t + angle * 0.3) % 1.0
            },
            GradientType::Wave => {
                let wave = (x as f64 * 0.02 + y as f64 * 0.02).sin() * 0.2;
                (t + wave).clamp(0.0, 1.0)
            },
        };
        
        let scaled_t = (modified_t * (color_count - 1) as f64).clamp(0.0, (color_count - 1) as f64);
        let index = scaled_t.floor() as usize;
        let fraction = scaled_t - index as f64;
        
        if index >= color_count - 1 {
            return scheme.colors[color_count - 1];
        }
        
        let color1 = scheme.colors[index];
        let color2 = scheme.colors[index + 1];
        
        [
            (color1[0] as f64 + (color2[0] as f64 - color1[0] as f64) * fraction) as u8,
            (color1[1] as f64 + (color2[1] as f64 - color1[1] as f64) * fraction) as u8,
            (color1[2] as f64 + (color2[2] as f64 - color1[2] as f64) * fraction) as u8,
        ]
    }
}
