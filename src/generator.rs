use anyhow::{Context, Result};
use indicatif::ProgressBar;
use rand::{Rng, SeedableRng};
use rand::rngs::StdRng;
use rayon::prelude::*;
use sha2::{Digest, Sha256};
use std::collections::HashSet;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tokio::task;

use crate::fractal::{FractalConfig, FractalGenerator};
use crate::metadata::{MetadataGenerator, RarityTier};
use crate::optimizer::{ImageOptimizer, OptimizationResult};

pub struct NFTGenerator {
    output_dir: PathBuf,
    image_size: u32,
    optimizer: ImageOptimizer,
    used_hashes: Arc<Mutex<HashSet<String>>>,
    rarity_tracker: Arc<Mutex<RarityTracker>>,
}

#[derive(Debug)]
struct RarityTracker {
    target_counts: std::collections::HashMap<RarityTier, u32>,
    current_counts: std::collections::HashMap<RarityTier, u32>,
}

impl RarityTracker {
    fn new(total_count: u32) -> Self {
        let mut target_counts = std::collections::HashMap::new();
        target_counts.insert(RarityTier::Common, (total_count as f64 * 0.50) as u32);
        target_counts.insert(RarityTier::Uncommon, (total_count as f64 * 0.30) as u32);
        target_counts.insert(RarityTier::Rare, (total_count as f64 * 0.15) as u32);
        target_counts.insert(RarityTier::Epic, (total_count as f64 * 0.04) as u32);
        target_counts.insert(RarityTier::Legendary, (total_count as f64 * 0.01) as u32);
        
        let mut current_counts = std::collections::HashMap::new();
        for tier in [RarityTier::Common, RarityTier::Uncommon, RarityTier::Rare, RarityTier::Epic, RarityTier::Legendary] {
            current_counts.insert(tier, 0);
        }
        
        Self {
            target_counts,
            current_counts,
        }
    }
    
    fn should_accept_rarity(&self, tier: RarityTier) -> bool {
        let current = self.current_counts.get(&tier).unwrap_or(&0);
        let target = self.target_counts.get(&tier).unwrap_or(&0);
        current < target
    }
    
    fn increment_rarity(&mut self, tier: RarityTier) {
        *self.current_counts.entry(tier).or_insert(0) += 1;
    }
    
    fn get_stats(&self) -> String {
        let mut stats = String::new();
        for (tier, count) in &self.current_counts {
            let target = self.target_counts.get(tier).unwrap_or(&0);
            stats.push_str(&format!("{:?}: {}/{} ", tier, count, target));
        }
        stats
    }
}

impl NFTGenerator {
    pub fn new(output_dir: PathBuf, image_size: u32, max_file_size: u64) -> Result<Self> {
        fs::create_dir_all(&output_dir)?;
        fs::create_dir_all(output_dir.join("images"))?;
        fs::create_dir_all(output_dir.join("metadata"))?;
        
        Ok(Self {
            output_dir,
            image_size,
            optimizer: ImageOptimizer::new(max_file_size),
            used_hashes: Arc::new(Mutex::new(HashSet::new())),
            rarity_tracker: Arc::new(Mutex::new(RarityTracker::new(4444))),
        })
    }
    
    pub fn output_dir(&self) -> &PathBuf {
        &self.output_dir
    }
    
    pub async fn generate_collection(&mut self, count: u32, progress_bar: ProgressBar) -> Result<()> {
        let mut successful_generations = 0u32;
        let mut attempts = 0u32;
        let max_attempts = count * 10; // Allow up to 10x attempts to handle duplicates
        
        while successful_generations < count && attempts < max_attempts {
            attempts += 1;
            
            // Generate a unique seed for this attempt
            let seed = self.generate_unique_seed(attempts as u64);
            let mut rng = StdRng::seed_from_u64(seed);
            
            // Generate fractal configuration
            let config = FractalConfig::random(&mut rng);
            
            // Calculate configuration hash for duplicate detection
            let config_hash = self.calculate_config_hash(&config);
            
            // Check if this configuration has been used before
            {
                let mut used_hashes = self.used_hashes.lock().unwrap();
                if used_hashes.contains(&config_hash) {
                    continue; // Skip duplicate configuration
                }
            }
            
            // Check rarity distribution
            let rarity_score = self.calculate_rarity_score(&config);
            let rarity_tier = RarityTier::from_score(rarity_score);
            
            {
                let rarity_tracker = self.rarity_tracker.lock().unwrap();
                if !rarity_tracker.should_accept_rarity(rarity_tier) {
                    continue; // Skip if we have enough of this rarity
                }
            }
            
            // Generate the NFT
            match self.generate_single_nft(successful_generations + 1, config.clone()).await {
                Ok(_) => {
                    // Mark configuration as used
                    {
                        let mut used_hashes = self.used_hashes.lock().unwrap();
                        used_hashes.insert(config_hash);
                    }
                    
                    // Update rarity tracker
                    {
                        let mut rarity_tracker = self.rarity_tracker.lock().unwrap();
                        rarity_tracker.increment_rarity(rarity_tier);
                    }
                    
                    successful_generations += 1;
                    progress_bar.inc(1);
                    
                    // Update progress bar message with rarity stats
                    if successful_generations % 100 == 0 {
                        let rarity_tracker = self.rarity_tracker.lock().unwrap();
                        progress_bar.set_message(format!("Generated: {} | {}", successful_generations, rarity_tracker.get_stats()));
                    }
                }
                Err(e) => {
                    eprintln!("Failed to generate NFT #{}: {}", successful_generations + 1, e);
                    continue;
                }
            }
        }
        
        progress_bar.finish_with_message(format!("Completed! Generated {} unique NFTs", successful_generations));
        
        if successful_generations < count {
            eprintln!("Warning: Only generated {} out of {} requested NFTs after {} attempts", 
                     successful_generations, count, attempts);
        }
        
        // Generate collection summary
        self.generate_collection_summary(successful_generations).await?;
        
        Ok(())
    }
    
    async fn generate_single_nft(&self, token_id: u32, config: FractalConfig) -> Result<()> {
        let config_clone = config.clone();
        let image_size = self.image_size;
        
        // Generate fractal image in a blocking task
        let img = task::spawn_blocking(move || {
            FractalGenerator::generate(&config_clone, image_size, image_size)
        }).await?;
        
        // Optimize image size
        let optimized_data = self.optimizer.optimize_to_target_size(&img)?;
        let file_extension = self.optimizer.get_file_extension(&optimized_data);
        
        // Save image
        let image_filename = format!("{:04}.{}", token_id, file_extension);
        let image_path = self.output_dir.join("images").join(&image_filename);
        fs::write(&image_path, &optimized_data)
            .context("Failed to write image file")?;
        
        // Generate and save metadata
        let metadata = MetadataGenerator::generate(
            token_id,
            &config,
            optimized_data.len() as u64,
            (img.width(), img.height()),
            file_extension,
        );
        
        let metadata_filename = format!("{:04}.json", token_id);
        let metadata_path = self.output_dir.join("metadata").join(&metadata_filename);
        let metadata_json = serde_json::to_string_pretty(&metadata)
            .context("Failed to serialize metadata")?;
        fs::write(&metadata_path, metadata_json)
            .context("Failed to write metadata file")?;
        
        Ok(())
    }
    
    fn generate_unique_seed(&self, attempt: u64) -> u64 {
        use std::time::{SystemTime, UNIX_EPOCH};
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos() as u64;
        
        // Combine timestamp with attempt number for uniqueness
        timestamp.wrapping_mul(31).wrapping_add(attempt)
    }
    
    fn calculate_config_hash(&self, config: &FractalConfig) -> String {
        let mut hasher = Sha256::new();
        
        // Hash fractal type
        hasher.update(format!("{:?}", config.fractal_type));
        
        // Hash color scheme
        hasher.update(&config.color_scheme.name);
        hasher.update(format!("{:?}", config.color_scheme.gradient_type));
        for color in &config.color_scheme.colors {
            hasher.update(format!("{:?}", color));
        }
        
        // Hash numerical parameters (rounded to avoid floating point precision issues)
        hasher.update(format!("{}", config.iterations));
        hasher.update(format!("{:.3}", config.zoom));
        hasher.update(format!("{:.3}", config.offset_x));
        hasher.update(format!("{:.3}", config.offset_y));
        hasher.update(format!("{:.3}", config.rotation));
        hasher.update(format!("{:.3}", config.complexity));
        
        format!("{:x}", hasher.finalize())
    }
    
    fn calculate_rarity_score(&self, config: &FractalConfig) -> f64 {
        let mut score = 0.0;
        
        // Fractal type rarity
        score += match config.fractal_type {
            crate::fractal::FractalType::Mandelbrot => 10.0,
            crate::fractal::FractalType::Julia => 20.0,
            crate::fractal::FractalType::BurningShip => 35.0,
            crate::fractal::FractalType::Phoenix => 50.0,
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
    
    async fn generate_collection_summary(&self, total_generated: u32) -> Result<()> {
        let rarity_tracker = self.rarity_tracker.lock().unwrap();
        
        let summary = serde_json::json!({
            "collection_name": "Fractal Genesis",
            "total_generated": total_generated,
            "generation_date": chrono::Utc::now().to_rfc3339(),
            "rarity_distribution": {
                "common": rarity_tracker.current_counts.get(&RarityTier::Common).unwrap_or(&0),
                "uncommon": rarity_tracker.current_counts.get(&RarityTier::Uncommon).unwrap_or(&0),
                "rare": rarity_tracker.current_counts.get(&RarityTier::Rare).unwrap_or(&0),
                "epic": rarity_tracker.current_counts.get(&RarityTier::Epic).unwrap_or(&0),
                "legendary": rarity_tracker.current_counts.get(&RarityTier::Legendary).unwrap_or(&0),
            },
            "technical_specs": {
                "max_file_size_kb": 5,
                "image_format": "PNG/JPEG (optimized)",
                "generation_engine": "Rust Mathematical Fractals",
                "duplicate_prevention": "SHA-256 Configuration Hashing"
            }
        });
        
        let summary_path = self.output_dir.join("collection_summary.json");
        fs::write(&summary_path, serde_json::to_string_pretty(&summary)?)
            .context("Failed to write collection summary")?;
        
        Ok(())
    }
}
