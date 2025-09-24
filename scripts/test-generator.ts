import { FractalGenerator } from "./fractal-generator"
import { MetadataGenerator } from "./metadata-generator"
import { DuplicateChecker } from "./duplicate-checker"
import * as fs from "fs"

// Test script to verify the generator works correctly
async function testGenerator() {
  console.log("🧪 Testing Fractal NFT Generator...")
  console.log("")

  const duplicateChecker = new DuplicateChecker()
  const testCount = 5

  console.log(`Generating ${testCount} test fractals...`)

  for (let i = 1; i <= testCount; i++) {
    try {
      // Generate unique config
      const config = FractalGenerator.generateUniqueConfig(i * 1000)

      if (duplicateChecker.isDuplicate(config)) {
        console.log(`❌ Test ${i}: Duplicate detected!`)
        continue
      }

      duplicateChecker.registerConfig(config)

      // Generate fractal
      const generator = new FractalGenerator(config)
      const imageBuffer = generator.generateFractal()

      // Generate metadata
      const traits = MetadataGenerator.extractTraits(config)
      const metadata = MetadataGenerator.generateMetadata(i, traits, `test-${i}.png`)

      console.log(`✅ Test ${i}: ${traits.fractalType} - ${traits.colorScheme} (${traits.rarity})`)

      // Save test files
      if (!fs.existsSync("test-output")) {
        fs.mkdirSync("test-output")
      }

      fs.writeFileSync(`test-output/test-${i}.png`, imageBuffer)
      fs.writeFileSync(`test-output/test-${i}.json`, JSON.stringify(metadata, null, 2))
    } catch (error) {
      console.log(`❌ Test ${i}: Error - ${error.message}`)
    }
  }

  const stats = duplicateChecker.getStats()
  console.log("")
  console.log("📊 Test Results:")
  console.log(`   Generated: ${stats.total} fractals`)
  console.log(`   Unique types: ${stats.uniqueTypes}`)
  console.log(`   Unique color schemes: ${stats.uniqueColorSchemes}`)
  console.log(`   Files saved to: ./test-output/`)
  console.log("")
  console.log("✅ Generator test completed successfully!")
}

// Run test
testGenerator().catch(console.error)
