#!/usr/bin/env node

import { NFTCollectionGenerator } from "./generate-nft-collection"

// Production-ready runner script with command line arguments
async function runGenerator() {
  const args = process.argv.slice(2)

  // Parse command line arguments
  let totalSupply = 4444
  let showHelp = false

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === "--help" || arg === "-h") {
      showHelp = true
      break
    } else if (arg === "--supply" || arg === "-s") {
      const nextArg = args[i + 1]
      if (nextArg && !isNaN(Number.parseInt(nextArg))) {
        totalSupply = Number.parseInt(nextArg)
        i++ // Skip next argument as it's the supply value
      } else {
        console.error("❌ Error: --supply requires a valid number")
        process.exit(1)
      }
    }
  }

  if (showHelp) {
    console.log("🎨 Fractal NFT Collection Generator")
    console.log("===================================")
    console.log("")
    console.log("Usage: npm run generate [options]")
    console.log("")
    console.log("Options:")
    console.log("  -s, --supply <number>  Total supply of NFTs to generate (default: 4444)")
    console.log("  -h, --help            Show this help message")
    console.log("")
    console.log("Examples:")
    console.log("  npm run generate                    # Generate 4444 NFTs")
    console.log("  npm run generate --supply 1000      # Generate 1000 NFTs")
    console.log("  npm run generate -s 10000           # Generate 10000 NFTs")
    console.log("")
    return
  }

  // Validate supply
  if (totalSupply < 1 || totalSupply > 100000) {
    console.error("❌ Error: Supply must be between 1 and 100,000")
    process.exit(1)
  }

  console.log("🎨 FRACTAL NFT COLLECTION GENERATOR")
  console.log("===================================")
  console.log(`📊 Total Supply: ${totalSupply.toLocaleString()} NFTs`)
  console.log(`🎯 Target: Zero duplicates, 100% unique fractals`)
  console.log(`📁 Output: ./nft-collection/`)
  console.log("")

  // Confirmation prompt for large collections
  if (totalSupply > 1000) {
    console.log(`⚠️  You're about to generate ${totalSupply.toLocaleString()} NFTs.`)
    console.log("   This may take several hours to complete.")
    console.log("   Press Ctrl+C to cancel, or wait 5 seconds to continue...")
    console.log("")

    await new Promise((resolve) => setTimeout(resolve, 5000))
  }

  try {
    const generator = new NFTCollectionGenerator(totalSupply)
    await generator.generateCollection()

    console.log("")
    console.log("🎉 Generation completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Fatal error during generation:", error)
    process.exit(1)
  }
}

// Handle process interruption gracefully
process.on("SIGINT", () => {
  console.log("")
  console.log("⚠️  Generation interrupted by user")
  console.log("   Partial collection may be available in ./nft-collection/")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("")
  console.log("⚠️  Generation terminated")
  process.exit(0)
})

// Run the generator
runGenerator().catch((error) => {
  console.error("❌ Unexpected error:", error)
  process.exit(1)
})
