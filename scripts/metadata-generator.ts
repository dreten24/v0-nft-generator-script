export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface NFTTraits {
  fractalType: string
  colorScheme: string
  complexity: string
  zoom: string
  rarity: string
  dimensions: string
  fileSize: string
  symmetry: string
  depth: string
  energy: string
  pattern: string
}

export class MetadataGenerator {
  static generateMetadata(tokenId: number, traits: NFTTraits, imageUrl: string): NFTMetadata {
    return {
      name: `Fractal Genesis #${tokenId}`,
      description: `A unique fractal NFT from the Fractal Genesis collection. This ${traits.fractalType} fractal features ${traits.complexity} complexity with a ${traits.colorScheme} color palette. Each piece is mathematically generated and completely unique, optimized to under 5KB while maintaining visual fidelity.`,
      image: imageUrl,
      attributes: [
        {
          trait_type: "Fractal Type",
          value: traits.fractalType,
        },
        {
          trait_type: "Color Scheme",
          value: traits.colorScheme,
        },
        {
          trait_type: "Complexity",
          value: traits.complexity,
        },
        {
          trait_type: "Zoom Level",
          value: traits.zoom,
        },
        {
          trait_type: "Rarity",
          value: traits.rarity,
        },
        {
          trait_type: "Generation",
          value: "Genesis",
        },
        {
          trait_type: "Dimensions",
          value: traits.dimensions,
        },
        {
          trait_type: "File Size",
          value: traits.fileSize,
        },
        {
          trait_type: "Symmetry",
          value: traits.symmetry,
        },
        {
          trait_type: "Depth",
          value: traits.depth,
        },
        {
          trait_type: "Energy",
          value: traits.energy,
        },
        {
          trait_type: "Pattern",
          value: traits.pattern,
        },
      ],
    }
  }

  static extractTraits(config: any, fileSize: number): NFTTraits {
    const fractalTypeNames = {
      mandelbrot: "Mandelbrot Set",
      julia: "Julia Set",
      burning_ship: "Burning Ship",
      tricorn: "Tricorn",
    }

    const colorSchemeNames = {
      "#FF6B6B,#4ECDC4,#45B7D1,#96CEB4,#FFEAA7": "Sunset Vibes",
      "#6C5CE7,#A29BFE,#FD79A8,#FDCB6E,#E17055": "Purple Dreams",
      "#00B894,#00CEC9,#0984E3,#6C5CE7,#A29BFE": "Ocean Depths",
      "#E84393,#FD79A8,#FDCB6E,#E17055,#D63031": "Fire Storm",
      "#74B9FF,#0984E3,#00B894,#00CEC9,#55A3FF": "Arctic Glow",
      "#FF7675,#FD79A8,#FDCB6E,#55EFC4,#74B9FF": "Rainbow Burst",
      "#A29BFE,#6C5CE7,#FD79A8,#FF7675,#74B9FF": "Cosmic Energy",
      "#00CEC9,#55EFC4,#FDCB6E,#FF7675,#A29BFE": "Neon Nights",
    }

    const colorKey = config.colorScheme.join(",")
    const colorSchemeName = colorSchemeNames[colorKey] || "Custom Palette"

    const complexity =
      config.iterations < 50 ? "Low" : config.iterations < 100 ? "Medium" : config.iterations < 130 ? "High" : "Ultra"

    const zoom = config.zoom < 1 ? "Wide" : config.zoom < 2 ? "Standard" : config.zoom < 2.5 ? "Close" : "Extreme"

    const dimensions = `${config.width}x${config.height}`
    const fileSizeKB = Math.round((fileSize / 1024) * 10) / 10
    const fileSizeCategory =
      fileSizeKB < 2 ? "Micro" : fileSizeKB < 3.5 ? "Compact" : fileSizeKB < 4.5 ? "Standard" : "Dense"

    // Symmetry based on fractal type and parameters
    const symmetry =
      config.fractalType === "mandelbrot"
        ? "Bilateral"
        : config.fractalType === "julia"
          ? "Rotational"
          : config.fractalType === "burning_ship"
            ? "Asymmetric"
            : "Complex"

    // Depth based on zoom and iterations
    const depth =
      config.zoom > 2 && config.iterations > 100
        ? "Deep"
        : config.zoom > 1.5 || config.iterations > 75
          ? "Medium"
          : "Shallow"

    // Energy based on color scheme and complexity
    const energyScore = config.colorScheme.length + config.iterations / 50
    const energy = energyScore > 7 ? "High" : energyScore > 5 ? "Medium" : "Low"

    // Pattern based on fractal type and zoom
    const pattern =
      config.fractalType === "mandelbrot" && config.zoom < 1
        ? "Classic"
        : config.fractalType === "julia"
          ? "Swirling"
          : config.fractalType === "burning_ship"
            ? "Jagged"
            : config.zoom > 2
              ? "Intricate"
              : "Flowing"

    // Enhanced rarity calculation
    let rarityScore = 0
    if (config.fractalType === "tricorn") rarityScore += 4
    else if (config.fractalType === "burning_ship") rarityScore += 3
    else if (config.fractalType === "julia") rarityScore += 2

    if (complexity === "Ultra") rarityScore += 4
    else if (complexity === "High") rarityScore += 3
    else if (complexity === "Medium") rarityScore += 1

    if (zoom === "Extreme") rarityScore += 3
    else if (zoom === "Close") rarityScore += 2

    if (config.width === 512) rarityScore += 2 // Higher resolution is rarer
    if (fileSizeKB > 4.5) rarityScore += 1 // Dense files are rarer

    const rarity =
      rarityScore >= 8
        ? "Legendary"
        : rarityScore >= 6
          ? "Epic"
          : rarityScore >= 4
            ? "Rare"
            : rarityScore >= 2
              ? "Uncommon"
              : "Common"

    return {
      fractalType: fractalTypeNames[config.fractalType] || config.fractalType,
      colorScheme: colorSchemeName,
      complexity,
      zoom,
      rarity,
      dimensions,
      fileSize: fileSizeCategory,
      symmetry,
      depth,
      energy,
      pattern,
    }
  }
}
