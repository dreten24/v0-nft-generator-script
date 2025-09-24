use serde::{Deserialize, Serialize};
use crate::fractal::{FractalConfig, FractalType, GradientType};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct NFTMetadata {
    pub name: String,
    pub description: String,
    pub image: String,
    pub external_url: Option<String>,
    pub attributes: Vec<Attribute>,
    pub properties: Properties,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Attribute {
    pub trait_type: String,
    pub value: serde_json::Value,
    pub display_type: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Properties {
    pub category: String,
    pub creator: String,
    pub generation_method: String,
    pub file_size_bytes: u64,
    pub dimensions: String,
    pub rarity_score: f64,
}

#[derive(Debug, Clone, Copy)]
pub enum RarityTier {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
}

impl RarityTier {
    pub fn from_score(score: f64) -> Self {
        match score {
            s if s >= 90.0 => RarityTier::Legendary,
            s if s >= 75.0 => RarityTier::Epic,
            s if s >= 50.0 => RarityTier::Rare,
            s if s >= 25.0 => RarityTier::Uncommon,
            _ => RarityTier::Common,
        }
    }
    
    pub fn as_str(&self) -> &'static str {
        match self {
            RarityTier::Common => "Common",
            RarityTier::Uncommon => "Uncommon",
            RarityTier::Rare => "Rare",
            RarityTier::Epic => "Epic",
            RarityTier::Legendary => "Legendary",
        }
    }
    
    pub fn distribution_percentage(&self) -> f64 {
        match self {
            RarityTier::Common => 50.0,
            RarityTier::Uncommon => 30.0,
            RarityTier::Rare => 15.0,
            RarityTier::Epic => 4.0,
            RarityTier::Legendary => 1.0,
        }
    }
}

pub struct MetadataGenerator;

impl MetadataGenerator {
    pub fn generate(
        token_id: u32,
        config: &FractalConfig,
        file_size: u64,
        dimensions: (u32, u32),
        file_extension: &str,
    ) -> NFTMetadata {
        let rarity_score = Self::calculate_rarity_score(config);
        let rarity_tier = RarityTier::from_score(rarity_score);
        
        let attributes = Self::generate_attributes(config, file_size, dimensions, rarity_tier, file_extension);
        
        NFTMetadata {
            name: format!("Fractal Genesis #{:04}", token_id),
            description: format!(
                "A unique {} fractal from the Genesis collection. This {} piece features {} patterns with {} complexity, generated using advanced mathematical algorithms. Each fractal is mathematically unique and optimized for perfect quality under 5KB.",
                Self::fractal_type_description(config.fractal_type),
                rarity_tier.as_str(),
                config.color_scheme.name.to_lowercase(),
                Self::complexity_description(config.complexity)
            ),
            image: format!("ipfs://{{IPFS_HASH}}/{:04}.{}", token_id, file_extension),
            external_url: Some("https://fractalgenesis.art".to_string()),
            attributes,
            properties: Properties {
                category: "Generative Art".to_string(),
                creator: "Fractal Genesis".to_string(),
                generation_method: "Rust Mathematical Engine".to_string(),
                file_size_bytes: file_size,
                dimensions: format!("{}x{}", dimensions.0, dimensions.1),
                rarity_score,
            },
        }
    }
    
    fn generate_attributes(
        config: &FractalConfig,
        file_size: u64,
        dimensions: (u32, u32),
        rarity_tier: RarityTier,
        file_extension: &str,
    ) -> Vec<Attribute> {
        let mut attributes = Vec::new();
        
        // Core fractal attributes
        attributes.push(Attribute {
            trait_type: "Fractal Type".to_string(),
            value: serde_json::Value::String(Self::fractal_type_name(config.fractal_type)),
            display_type: None,
        });
        
        attributes.push(Attribute {
            trait_type: "Color Scheme".to_string(),
            value: serde_json::Value::String(config.color_scheme.name.clone()),
            display_type: None,
        });
        
        attributes.push(Attribute {
            trait_type: "Gradient Style".to_string(),
            value: serde_json::Value::String(Self::gradient_type_name(config.color_scheme.gradient_type)),
            display_type: None,
        });
        
        // Rarity and complexity
        attributes.push(Attribute {
            trait_type: "Rarity".to_string(),
            value: serde_json::Value::String(rarity_tier.as_str().to_string()),
            display_type: None,
        });
        
        attributes.push(Attribute {
            trait_type: "Complexity Level".to_string(),
            value: serde_json::Value::String(Self::complexity_tier(config.complexity)),
            display_type: None,
        });
        
        // Technical attributes
        attributes.push(Attribute {
            trait_type: "Iterations".to_string(),
            value: serde_json::Value::Number(serde_json::Number::from(config.iterations)),
            display_type: Some("number".to_string()),
        });
        
        attributes.push(Attribute {
            trait_type: "Zoom Level".to_string(),
            value: serde_json::Value::String(Self::zoom_category(config.zoom)),
            display_type: None,
        });
        
        attributes.push(Attribute {
            trait_type: "Symmetry Pattern".to_string(),
            value: serde_json::Value::String(Self::symmetry_pattern(config.rotation)),
            display_type: None,
        });
        
        // File attributes
        attributes.push(Attribute {
            trait_type: "File Format".to_string(),
            value: serde_json::Value::String(file_extension.to_uppercase()),
            display_type: None,
        });
        
        attributes.push(Attribute {
            trait_type: "File Size Category".to_string(),
            value: serde_json::Value::String(Self::file_size_category(file_size)),
            display_type: None,
        });
        
        attributes.push(Attribute {
            trait_type: "Resolution".to_string(),
            value: serde_json::Value::String(format!("{}x{}", dimensions.0, dimensions.1)),
            display_type: None,
        });
        
        // Unique pattern attributes
        attributes.push(Attribute {
            trait_type: "Energy Level".to_string(),
            value: serde_json::Value::String(Self::energy_level(config.iterations, config.complexity)),
            display_type: None,
        });
        
        attributes.push(Attribute {
            trait_type: "Visual Depth".to_string(),
            value: serde_json::Value::String(Self::depth_category(config.zoom, config.complexity)),
            display_type: None,
        });
        
        attributes
    }
    
    fn calculate_rarity_score(config: &FractalConfig) -> f64 {
        let mut score = 0.0;
        
        // Fractal type rarity
        score += match config.fractal_type {
            FractalType::Mandelbrot => 10.0,
            FractalType::Julia => 20.0,
            FractalType::BurningShip => 35.0,
            FractalType::Phoenix => 50.0,
        };
        
        // Complexity bonus
        score += config.complexity * 15.0;
        
        // High iteration bonus
        if config.iterations > 150 {
            score += 20.0;
        }
        
        // Extreme zoom bonus
        if config.zoom > 3.0 || config.zoom < 0.7 {
            score += 15.0;
        }
        
        // Color scheme rarity
        score += match config.color_scheme.name.as_str() {
            "Cosmic Purple" => 5.0,
            "Ocean Depths" => 5.0,
            "Fire Storm" => 10.0,
            "Forest Mystique" => 10.0,
            "Arctic Aurora" => 15.0,
            "Sunset Blaze" => 15.0,
            "Neon Dreams" => 25.0,
            "Golden Horizon" => 25.0,
            _ => 0.0,
        };
        
        score.min(100.0)
    }
    
    fn fractal_type_name(fractal_type: FractalType) -> String {
        match fractal_type {
            FractalType::Mandelbrot => "Mandelbrot Set".to_string(),
            FractalType::Julia => "Julia Set".to_string(),
            FractalType::BurningShip => "Burning Ship".to_string(),
            FractalType::Phoenix => "Phoenix Fractal".to_string(),
        }
    }
    
    fn fractal_type_description(fractal_type: FractalType) -> &'static str {
        match fractal_type {
            FractalType::Mandelbrot => "Mandelbrot",
            FractalType::Julia => "Julia",
            FractalType::BurningShip => "Burning Ship",
            FractalType::Phoenix => "Phoenix",
        }
    }
    
    fn gradient_type_name(gradient_type: GradientType) -> String {
        match gradient_type {
            GradientType::Linear => "Linear Flow".to_string(),
            GradientType::Radial => "Radial Burst".to_string(),
            GradientType::Spiral => "Spiral Dance".to_string(),
            GradientType::Wave => "Wave Pattern".to_string(),
        }
    }
    
    fn complexity_description(complexity: f64) -> &'static str {
        match complexity {
            c if c < 0.5 => "minimal",
            c if c < 1.0 => "moderate",
            c if c < 1.5 => "high",
            _ => "extreme",
        }
    }
    
    fn complexity_tier(complexity: f64) -> String {
        match complexity {
            c if c < 0.3 => "Minimal".to_string(),
            c if c < 0.6 => "Low".to_string(),
            c if c < 1.0 => "Medium".to_string(),
            c if c < 1.4 => "High".to_string(),
            c if c < 1.7 => "Very High".to_string(),
            _ => "Extreme".to_string(),
        }
    }
    
    fn zoom_category(zoom: f64) -> String {
        match zoom {
            z if z < 0.7 => "Wide View".to_string(),
            z if z < 1.2 => "Standard".to_string(),
            z if z < 2.0 => "Close Up".to_string(),
            z if z < 3.0 => "Macro".to_string(),
            _ => "Ultra Macro".to_string(),
        }
    }
    
    fn symmetry_pattern(rotation: f64) -> String {
        let normalized = (rotation % (2.0 * std::f64::consts::PI)) / (2.0 * std::f64::consts::PI);
        match normalized {
            r if r < 0.125 => "Aligned".to_string(),
            r if r < 0.375 => "Quarter Turn".to_string(),
            r if r < 0.625 => "Half Turn".to_string(),
            r if r < 0.875 => "Three Quarter".to_string(),
            _ => "Full Rotation".to_string(),
        }
    }
    
    fn file_size_category(size: u64) -> String {
        match size {
            s if s < 1024 => "Ultra Compact".to_string(),
            s if s < 2048 => "Compact".to_string(),
            s if s < 3072 => "Optimized".to_string(),
            s if s < 4096 => "Standard".to_string(),
            _ => "Maximum".to_string(),
        }
    }
    
    fn energy_level(iterations: u32, complexity: f64) -> String {
        let energy = iterations as f64 * complexity;
        match energy {
            e if e < 50.0 => "Calm".to_string(),
            e if e < 100.0 => "Gentle".to_string(),
            e if e < 200.0 => "Active".to_string(),
            e if e < 300.0 => "Intense".to_string(),
            _ => "Explosive".to_string(),
        }
    }
    
    fn depth_category(zoom: f64, complexity: f64) -> String {
        let depth = zoom * complexity;
        match depth {
            d if d < 0.5 => "Surface".to_string(),
            d if d < 1.0 => "Shallow".to_string(),
            d if d < 2.0 => "Deep".to_string(),
            d if d < 4.0 => "Profound".to_string(),
            _ => "Infinite".to_string(),
        }
    }
}
