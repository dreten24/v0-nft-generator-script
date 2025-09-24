#!/bin/bash

echo "🎨 Fractal NFT Generator - Production Run"
echo "=========================================="

# Check if binary exists
if [ ! -f "target/release/generate" ]; then
    echo "❌ Binary not found. Please run ./build.sh first"
    exit 1
fi

# Create output directory with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_DIR="nft_collection_$TIMESTAMP"

echo "📁 Output directory: $OUTPUT_DIR"
echo "🎯 Generating 4444 unique fractal NFTs..."
echo "📏 Image size: 512x512 pixels"
echo "💾 Max file size: 5KB per image"
echo ""

# Run the generator
./target/release/generate \
    --output-dir "$OUTPUT_DIR" \
    --count 4444 \
    --size 512 \
    --max-file-size 5120

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Generation Complete!"
    echo "📊 Collection Summary:"
    echo "   • Images: $OUTPUT_DIR/images/"
    echo "   • Metadata: $OUTPUT_DIR/metadata/"
    echo "   • Summary: $OUTPUT_DIR/collection_summary.json"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Upload images to IPFS"
    echo "   2. Update metadata with IPFS hashes"
    echo "   3. Deploy smart contract"
    echo "   4. Launch your collection!"
    
    # Show collection stats
    if [ -f "$OUTPUT_DIR/collection_summary.json" ]; then
        echo ""
        echo "📈 Rarity Distribution:"
        cat "$OUTPUT_DIR/collection_summary.json" | grep -A 10 "rarity_distribution"
    fi
else
    echo "❌ Generation failed!"
    exit 1
fi
