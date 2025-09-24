import * as fs from "fs"
import * as path from "path"
import { FractalGenerator, type FractalConfig } from "./fractal-generator"
import { MetadataGenerator } from "./metadata-generator"
import { DuplicateChecker } from "./duplicate-checker"

interface GenerationProgress {
  current: number
  total: number
  successful: number
  duplicatesSkipped: number
  errors: number
  startTime: Date
  estimatedTimeRemaining?: string
}

class NFTCollectionGenerator {
  private duplicateChecker = new DuplicateChecker()
  private progress: GenerationProgress
  private outputDir: string
  private imagesDir: string
  private metadataDir: string

  constructor(private totalSupply = 4444) {
    this.progress = {
      current: 0,
      total: totalSupply,
      successful: 0,
      duplicatesSkipped: 0,
      errors: 0,
      startTime: new Date(),
    }

    // Setup output directories
    this.outputDir = path.join(process.cwd(), "nft-collection")
    this.imagesDir = path.join(this.outputDir, "images")
    this.metadataDir = path.join(this.outputDir, "metadata")

    this.setupDirectories()
  }

  private setupDirectories(): void {
    // Create output directories if they don't exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true })
    }
    if (!fs.existsSync(this.metadataDir)) {
      fs.mkdirSync(this.metadataDir, { recursive: true })
    }

    console.log(`📁 Output directories created:`)
    console.log(`   Images: ${this.imagesDir}`)
    console.log(`   Metadata: ${this.metadataDir}`)
  }

  private updateProgress(): void {
    const elapsed = Date.now() - this.progress.startTime.getTime()
    const avgTimePerNFT = elapsed / Math.max(this.progress.current, 1)
    const remaining = this.progress.total - this.progress.successful
    const estimatedMs = remaining * avgTimePerNFT

    const hours = Math.floor(estimatedMs / (1000 * 60 * 60))
    const minutes = Math.floor((estimatedMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((estimatedMs % (1000 * 60)) / 1000)

    this.progress.estimatedTimeRemaining = `${hours}h ${minutes}m ${seconds}s`
  }

  private logProgress(): void {
    this.updateProgress()
    const percentage = ((this.progress.successful / this.progress.total) * 100).toFixed(1)

    console.clear()
    console.log("🎨 FRACTAL NFT COLLECTION GENERATOR")
    console.log("=====================================")
    console.log(`Progress: ${this.progress.successful}/${this.progress.total} (${percentage}%)`)
    console.log(`✅ Successful: ${this.progress.successful}`)
    console.log(`⏭️  Duplicates Skipped: ${this.progress.duplicatesSkipped}`)
    console.log(`❌ Errors: ${this.progress.errors}`)
    console.log(`⏱️  Estimated Time Remaining: ${this.progress.estimatedTimeRemaining}`)
    console.log("=====================================")

    // Progress bar
    const barLength = 40
    const filledLength = Math.floor((this.progress.successful / this.progress.total) * barLength)
    const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength)
    console.log(`[${bar}] ${percentage}%`)
    console.log("")
  }

  private generateUniqueConfig(attempt: number): FractalConfig | null {
    const maxAttempts = 100
    let attempts = 0

    while (attempts < maxAttempts) {
      const seed = attempt * 1000 + attempts
      const config = FractalGenerator.generateUniqueConfig(seed)

      if (!this.duplicateChecker.isDuplicate(config)) {
        this.duplicateChecker.registerConfig(config)
        return config
      }

      attempts++
    }

    console.warn(`⚠️  Could not generate unique config after ${maxAttempts} attempts for NFT #${attempt}`)
    return null
  }

  private async generateSingleNFT(tokenId: number): Promise<boolean> {
    try {
      // Generate unique configuration
      const config = this.generateUniqueConfig(tokenId)
      if (!config) {
        this.progress.duplicatesSkipped++
        return false
      }

      // Generate fractal image
      const generator = new FractalGenerator(config)
      const imageBuffer = generator.generateFractal()

      // Save image
      const imagePath = path.join(this.imagesDir, `${tokenId}.png`)
      fs.writeFileSync(imagePath, imageBuffer)

      // Generate metadata
      const traits = MetadataGenerator.extractTraits(config)
      const imageUrl = `ipfs://YOUR_IPFS_HASH/${tokenId}.png` // Replace with actual IPFS hash
      const metadata = MetadataGenerator.generateMetadata(tokenId, traits, imageUrl)

      // Save metadata
      const metadataPath = path.join(this.metadataDir, `${tokenId}.json`)
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))

      this.progress.successful++
      return true
    } catch (error) {
      console.error(`❌ Error generating NFT #${tokenId}:`, error)
      this.progress.errors++
      return false
    }
  }

  async generateCollection(): Promise<void> {
    console.log(`🚀 Starting generation of ${this.totalSupply} NFTs...`)
    console.log("")

    let tokenId = 1

    while (this.progress.successful < this.totalSupply) {
      this.progress.current = tokenId

      const success = await this.generateSingleNFT(tokenId)

      // Log progress every 10 NFTs or on errors
      if (tokenId % 10 === 0 || !success) {
        this.logProgress()
      }

      tokenId++

      // Safety check to prevent infinite loop
      if (tokenId > this.totalSupply * 2) {
        console.error("❌ Too many attempts, stopping generation")
        break
      }
    }

    this.generateSummaryReport()
  }

  private generateSummaryReport(): void {
    const stats = this.duplicateChecker.getStats()
    const endTime = new Date()
    const totalTime = endTime.getTime() - this.progress.startTime.getTime()
    const hours = Math.floor(totalTime / (1000 * 60 * 60))
    const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((totalTime % (1000 * 60)) / 1000)

    const report = {
      collectionName: "Fractal Genesis",
      totalSupply: this.totalSupply,
      generated: this.progress.successful,
      duplicatesSkipped: this.progress.duplicatesSkipped,
      errors: this.progress.errors,
      uniqueFractalTypes: stats.uniqueTypes,
      uniqueColorSchemes: stats.uniqueColorSchemes,
      generationTime: `${hours}h ${minutes}m ${seconds}s`,
      startTime: this.progress.startTime.toISOString(),
      endTime: endTime.toISOString(),
      outputDirectory: this.outputDir,
      imagesDirectory: this.imagesDir,
      metadataDirectory: this.metadataDir,
    }

    // Save report
    const reportPath = path.join(this.outputDir, "generation-report.json")
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    // Display final summary
    console.clear()
    console.log("🎉 COLLECTION GENERATION COMPLETE!")
    console.log("==================================")
    console.log(`✅ Successfully generated: ${this.progress.successful}/${this.totalSupply} NFTs`)
    console.log(`⏭️  Duplicates skipped: ${this.progress.duplicatesSkipped}`)
    console.log(`❌ Errors encountered: ${this.progress.errors}`)
    console.log(`🎨 Unique fractal types: ${stats.uniqueTypes}`)
    console.log(`🌈 Unique color schemes: ${stats.uniqueColorSchemes}`)
    console.log(`⏱️  Total generation time: ${hours}h ${minutes}m ${seconds}s`)
    console.log("==================================")
    console.log(`📁 Files saved to: ${this.outputDir}`)
    console.log(`📊 Full report saved to: ${reportPath}`)
    console.log("")
    console.log("🚀 Your NFT collection is ready for launch!")
    console.log("")
    console.log("Next steps:")
    console.log("1. Upload images to IPFS")
    console.log("2. Update metadata files with IPFS hashes")
    console.log("3. Deploy your smart contract")
    console.log("4. Launch your collection!")
  }
}

// Main execution
async function main() {
  const generator = new NFTCollectionGenerator(4444)
  await generator.generateCollection()
}

// Run the generator
if (require.main === module) {
  main().catch(console.error)
}

export { NFTCollectionGenerator }
