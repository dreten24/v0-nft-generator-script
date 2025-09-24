use anyhow::Result;
use clap::Parser;
use indicatif::{ProgressBar, ProgressStyle};
use std::path::PathBuf;

mod fractal;
mod metadata;
mod optimizer;
mod generator;

use generator::NFTGenerator;

#[derive(Parser)]
#[command(name = "fractal-nft-generator")]
#[command(about = "Generate 4444 unique fractal NFTs under 5KB each")]
struct Args {
    #[arg(short, long, default_value = "output")]
    output_dir: PathBuf,
    
    #[arg(short, long, default_value = "4444")]
    count: u32,
    
    #[arg(short, long, default_value = "512")]
    size: u32,
    
    #[arg(long, default_value = "5120")]
    max_file_size: u64, // 5KB in bytes
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    
    println!("🚀 Fractal NFT Generator v1.0.0");
    println!("Generating {} unique fractals at {}x{} pixels", args.count, args.size, args.size);
    println!("Maximum file size: {}KB", args.max_file_size / 1024);
    println!("Output directory: {}", args.output_dir.display());
    
    let pb = ProgressBar::new(args.count as u64);
    pb.set_style(
        ProgressStyle::default_bar()
            .template("{spinner:.green} [{elapsed_precise}] [{bar:40.cyan/blue}] {pos}/{len} ({eta})")
            .unwrap()
            .progress_chars("#>-"),
    );
    
    let mut generator = NFTGenerator::new(args.output_dir, args.size, args.max_file_size)?;
    generator.generate_collection(args.count, pb).await?;
    
    println!("✅ Successfully generated {} unique fractal NFTs!", args.count);
    println!("📁 Files saved to: {}", generator.output_dir().display());
    
    Ok(())
}
