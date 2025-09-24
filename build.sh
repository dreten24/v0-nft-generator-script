#!/bin/bash

echo "🚀 Building Fractal NFT Generator for Production..."

# Clean previous builds
cargo clean

# Build optimized release binary
echo "📦 Compiling optimized release binary..."
cargo build --release

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Binary location: target/release/generate"
    echo ""
    echo "🎯 Ready to generate 4444 unique fractals!"
    echo "💡 Usage: ./target/release/generate --help"
else
    echo "❌ Build failed!"
    exit 1
fi
