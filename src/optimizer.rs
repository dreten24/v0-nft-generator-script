use anyhow::{Context, Result};
use image::{ImageFormat, RgbImage};
use std::io::Cursor;

pub struct ImageOptimizer {
    max_file_size: u64,
}

impl ImageOptimizer {
    pub fn new(max_file_size: u64) -> Self {
        Self { max_file_size }
    }
    
    pub fn optimize_to_target_size(&self, img: &RgbImage) -> Result<Vec<u8>> {
        // Try PNG first with different compression levels
        if let Ok(png_data) = self.encode_png(img, 9) {
            if png_data.len() as u64 <= self.max_file_size {
                return Ok(png_data);
            }
        }
        
        // If PNG is too large, try JPEG with different quality levels
        for quality in (60..=95).rev().step_by(5) {
            if let Ok(jpeg_data) = self.encode_jpeg(img, quality) {
                if jpeg_data.len() as u64 <= self.max_file_size {
                    return Ok(jpeg_data);
                }
            }
        }
        
        // If still too large, resize and try again
        let scale_factors = [0.9, 0.8, 0.7, 0.6, 0.5];
        for &scale in &scale_factors {
            let new_width = (img.width() as f32 * scale) as u32;
            let new_height = (img.height() as f32 * scale) as u32;
            
            if new_width < 256 || new_height < 256 {
                break; // Don't go too small
            }
            
            let resized = image::imageops::resize(
                img,
                new_width,
                new_height,
                image::imageops::FilterType::Lanczos3,
            );
            
            // Try PNG first
            if let Ok(png_data) = self.encode_png(&resized, 9) {
                if png_data.len() as u64 <= self.max_file_size {
                    return Ok(png_data);
                }
            }
            
            // Then JPEG
            for quality in (50..=90).rev().step_by(10) {
                if let Ok(jpeg_data) = self.encode_jpeg(&resized, quality) {
                    if jpeg_data.len() as u64 <= self.max_file_size {
                        return Ok(jpeg_data);
                    }
                }
            }
        }
        
        // Last resort: very aggressive JPEG compression
        let jpeg_data = self.encode_jpeg(img, 30)
            .context("Failed to encode image even with lowest quality")?;
        
        Ok(jpeg_data)
    }
    
    fn encode_png(&self, img: &RgbImage, compression: u8) -> Result<Vec<u8>> {
        let mut buffer = Vec::new();
        let mut cursor = Cursor::new(&mut buffer);
        
        let encoder = image::codecs::png::PngEncoder::new_with_quality(
            &mut cursor,
            image::codecs::png::CompressionType::Best,
            image::codecs::png::FilterType::Adaptive,
        );
        
        encoder.encode(
            img.as_raw(),
            img.width(),
            img.height(),
            image::ColorType::Rgb8,
        )?;
        
        Ok(buffer)
    }
    
    fn encode_jpeg(&self, img: &RgbImage, quality: u8) -> Result<Vec<u8>> {
        let mut buffer = Vec::new();
        let mut cursor = Cursor::new(&mut buffer);
        
        let encoder = image::codecs::jpeg::JpegEncoder::new_with_quality(&mut cursor, quality);
        encoder.encode(
            img.as_raw(),
            img.width(),
            img.height(),
            image::ColorType::Rgb8,
        )?;
        
        Ok(buffer)
    }
    
    pub fn get_file_extension(&self, data: &[u8]) -> &'static str {
        // Check if it's PNG (starts with PNG signature)
        if data.len() >= 8 && &data[0..8] == b"\x89PNG\r\n\x1a\n" {
            "png"
        } else {
            "jpg"
        }
    }
    
    pub fn calculate_compression_stats(&self, original_size: usize, compressed_size: usize) -> f64 {
        if original_size == 0 {
            return 0.0;
        }
        (1.0 - (compressed_size as f64 / original_size as f64)) * 100.0
    }
}

#[derive(Debug, Clone)]
pub struct OptimizationResult {
    pub data: Vec<u8>,
    pub format: String,
    pub original_size: usize,
    pub compressed_size: usize,
    pub compression_ratio: f64,
    pub dimensions: (u32, u32),
}

impl OptimizationResult {
    pub fn new(
        data: Vec<u8>,
        format: String,
        original_size: usize,
        dimensions: (u32, u32),
        optimizer: &ImageOptimizer,
    ) -> Self {
        let compressed_size = data.len();
        let compression_ratio = optimizer.calculate_compression_stats(original_size, compressed_size);
        
        Self {
            data,
            format,
            original_size,
            compressed_size,
            compression_ratio,
            dimensions,
        }
    }
}
