import * as crypto from "crypto"

export class DuplicateChecker {
  private generatedHashes: Set<string> = new Set()
  private generatedConfigs: Map<string, any> = new Map()

  // Generate a hash from the fractal configuration
  generateConfigHash(config: any): string {
    const configString = JSON.stringify({
      fractalType: config.fractalType,
      iterations: config.iterations,
      zoom: Math.round(config.zoom * 1000) / 1000, // Round to 3 decimal places
      centerX: Math.round(config.centerX * 1000) / 1000,
      centerY: Math.round(config.centerY * 1000) / 1000,
      colorScheme: config.colorScheme.sort(), // Sort to ensure consistent ordering
      juliaC: config.juliaC
        ? {
            real: Math.round(config.juliaC.real * 1000) / 1000,
            imag: Math.round(config.juliaC.imag * 1000) / 1000,
          }
        : null,
    })

    return crypto.createHash("sha256").update(configString).digest("hex")
  }

  // Check if a configuration would create a duplicate
  isDuplicate(config: any): boolean {
    const hash = this.generateConfigHash(config)
    return this.generatedHashes.has(hash)
  }

  // Register a configuration as used
  registerConfig(config: any): string {
    const hash = this.generateConfigHash(config)
    this.generatedHashes.add(hash)
    this.generatedConfigs.set(hash, config)
    return hash
  }

  // Get statistics about generated configs
  getStats(): { total: number; uniqueTypes: number; uniqueColorSchemes: number } {
    const types = new Set()
    const colorSchemes = new Set()

    for (const config of this.generatedConfigs.values()) {
      types.add(config.fractalType)
      colorSchemes.add(config.colorScheme.join(","))
    }

    return {
      total: this.generatedConfigs.size,
      uniqueTypes: types.size,
      uniqueColorSchemes: colorSchemes.size,
    }
  }

  // Clear all registered configs (for testing)
  clear(): void {
    this.generatedHashes.clear()
    this.generatedConfigs.clear()
  }
}
