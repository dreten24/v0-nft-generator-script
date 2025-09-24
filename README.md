# Fractal NFT Collection Generator

A production-ready NFT generator that creates 4444 unique fractal-based NFTs with zero duplicates. Each NFT features mathematically generated fractals with unique color schemes, complexity levels, and rarity traits.

## Features

- **4 Fractal Types**: Mandelbrot Set, Julia Set, Burning Ship, Tricorn
- **8 Color Schemes**: Sunset Vibes, Purple Dreams, Ocean Depths, Fire Storm, Arctic Glow, Rainbow Burst, Cosmic Energy, Neon Nights
- **Zero Duplicates**: Advanced duplicate detection ensures every NFT is unique
- **Rarity System**: Automatic rarity assignment based on fractal complexity and zoom levels
- **Production Ready**: Optimized for large-scale generation with progress tracking
- **Complete Metadata**: OpenSea-compatible JSON metadata for each NFT

## Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Generate Your Collection
\`\`\`bash
# Generate full 4444 NFT collection
npm run generate

# Generate test collection (10 NFTs)
npm run generate:test

# Generate custom amount
npm run generate -- --supply 1000
\`\`\`

### 3. Output Structure
\`\`\`
nft-collection/
├── images/           # PNG images (512x512px)
│   ├── 1.png
│   ├── 2.png
│   └── ...
├── metadata/         # JSON metadata files
│   ├── 1.json
│   ├── 2.json
│   └── ...
└── generation-report.json  # Generation statistics
\`\`\`

## Rarity Distribution

- **Common** (60%): Basic fractals with standard parameters
- **Rare** (25%): Enhanced complexity or unique zoom levels
- **Epic** (12%): Advanced fractal types with high complexity
- **Legendary** (3%): Ultra-rare combinations of extreme parameters

## Fractal Types

### Mandelbrot Set
The classic fractal set, featuring intricate boundary patterns and infinite detail.

### Julia Set
Dynamic fractals with customizable complex parameters, creating diverse organic shapes.

### Burning Ship
A variation of the Mandelbrot set with absolute value operations, creating ship-like formations.

### Tricorn
The "Mandelbar" set with conjugate operations, producing unique three-pointed structures.

## Color Schemes

1. **Sunset Vibes**: Warm oranges, teals, and blues
2. **Purple Dreams**: Rich purples, pinks, and golds
3. **Ocean Depths**: Deep blues, teals, and purples
4. **Fire Storm**: Intense reds, pinks, and oranges
5. **Arctic Glow**: Cool blues and teals
6. **Rainbow Burst**: Vibrant multi-color palette
7. **Cosmic Energy**: Purple and pink cosmic themes
8. **Neon Nights**: Electric teals, yellows, and purples

## Generation Process

1. **Unique Configuration**: Each NFT gets a mathematically unique fractal configuration
2. **Duplicate Prevention**: SHA-256 hashing ensures no two NFTs are identical
3. **Image Generation**: High-quality 512x512px PNG images using HTML5 Canvas
4. **Metadata Creation**: OpenSea-compatible JSON with detailed trait information
5. **Progress Tracking**: Real-time progress updates with time estimates

## Deployment Checklist

- [ ] Generate your collection
- [ ] Upload images to IPFS (Pinata, NFT.Storage, etc.)
- [ ] Update metadata files with IPFS image URLs
- [ ] Deploy smart contract (ERC-721)
- [ ] Upload metadata to IPFS
- [ ] Set base URI in smart contract
- [ ] Launch on OpenSea or marketplace

## Technical Specifications

- **Image Format**: PNG, 512x512px
- **Color Depth**: 24-bit RGB
- **Metadata Standard**: OpenSea compatible
- **Generation Speed**: ~2-5 seconds per NFT
- **Memory Usage**: ~50MB peak during generation
- **Storage**: ~1.5MB per NFT (image + metadata)

## Command Line Options

\`\`\`bash
npm run generate [options]

Options:
  -s, --supply <number>  Total supply of NFTs to generate (default: 4444)
  -h, --help            Show help message

Examples:
  npm run generate                    # Generate 4444 NFTs
  npm run generate --supply 1000      # Generate 1000 NFTs
  npm run generate -s 10000           # Generate 10000 NFTs
\`\`\`

## Troubleshooting

### Canvas Installation Issues
If you encounter canvas installation errors:
\`\`\`bash
# On macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg

# On Ubuntu/Debian
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# On Windows
# Install windows-build-tools
npm install --global windows-build-tools
\`\`\`

### Memory Issues
For large collections (>10k NFTs):
\`\`\`bash
node --max-old-space-size=8192 scripts/run-generator.ts --supply 10000
\`\`\`

## License

MIT License - Feel free to use this generator for your NFT projects!

## Support

For issues or questions, please check the generation report for detailed statistics and error logs.
