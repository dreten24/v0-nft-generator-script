#!/bin/bash

echo "🧪 Quick Test - Generating 10 Sample NFTs"
echo "========================================="

# Build if needed
if [ ! -f "target/release/generate" ]; then
    echo "📦 Building first..."
    cargo build --release
fi

# Generate test batch
./target/release/generate \
    --output-dir "test_output" \
    --count 10 \
    --size 512 \
    --max-file-size 5120

echo ""
echo "✅ Test complete! Check test_output/ directory"
