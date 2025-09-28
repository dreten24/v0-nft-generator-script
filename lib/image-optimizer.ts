export interface OptimizationResult {
  blob: Blob
  format: string
  sizeKB: number
  quality: number
}

export class ImageOptimizer {
  private static readonly TARGET_SIZE_KB = 8
  private static readonly MAX_DIMENSION = 512

  static async optimizeForSize(
    canvas: HTMLCanvasElement,
    targetSizeKB: number = this.TARGET_SIZE_KB,
  ): Promise<OptimizationResult> {
    // Resize canvas if too large
    const optimizedCanvas = this.resizeCanvas(canvas, this.MAX_DIMENSION)

    // Try different optimization strategies
    const strategies = [
      { format: "webp", quality: 0.85 },
      { format: "webp", quality: 0.75 },
      { format: "webp", quality: 0.65 },
      { format: "jpeg", quality: 0.9 },
      { format: "jpeg", quality: 0.85 },
      { format: "jpeg", quality: 0.8 },
      { format: "jpeg", quality: 0.75 },
      { format: "png", quality: 1.0 },
    ]

    let bestResult: OptimizationResult | null = null

    for (const strategy of strategies) {
      try {
        const blob = await this.canvasToBlob(optimizedCanvas, strategy.format, strategy.quality)
        const sizeKB = blob.size / 1024

        // If under target size, we found our solution
        if (sizeKB <= targetSizeKB) {
          return {
            blob,
            format: strategy.format,
            sizeKB: Math.round(sizeKB * 100) / 100,
            quality: strategy.quality,
          }
        }

        // Track the best result even if over target
        if (!bestResult || sizeKB < bestResult.sizeKB) {
          bestResult = {
            blob,
            format: strategy.format,
            sizeKB: Math.round(sizeKB * 100) / 100,
            quality: strategy.quality,
          }
        }
      } catch (error) {
        console.warn(`Failed to optimize with ${strategy.format} at quality ${strategy.quality}:`, error)
      }
    }

    return (
      bestResult || {
        blob: await this.canvasToBlob(optimizedCanvas, "png", 1.0),
        format: "png",
        sizeKB: 0,
        quality: 1.0,
      }
    )
  }

  private static resizeCanvas(canvas: HTMLCanvasElement, maxDimension: number): HTMLCanvasElement {
    const { width, height } = canvas

    // If already small enough, return original
    if (width <= maxDimension && height <= maxDimension) {
      return canvas
    }

    // Calculate new dimensions maintaining aspect ratio
    const scale = Math.min(maxDimension / width, maxDimension / height)
    const newWidth = Math.round(width * scale)
    const newHeight = Math.round(height * scale)

    // Create new canvas with optimized size
    const resizedCanvas = document.createElement("canvas")
    resizedCanvas.width = newWidth
    resizedCanvas.height = newHeight

    const ctx = resizedCanvas.getContext("2d")!

    // Use high-quality scaling
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Draw resized image
    ctx.drawImage(canvas, 0, 0, newWidth, newHeight)

    return resizedCanvas
  }

  private static canvasToBlob(canvas: HTMLCanvasElement, format: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const mimeType = format === "webp" ? "image/webp" : format === "jpeg" ? "image/jpeg" : "image/png"

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error(`Failed to create blob with format ${format}`))
          }
        },
        mimeType,
        format === "png" ? undefined : quality,
      )
    })
  }

  static formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  static async downloadOptimizedImage(
    canvas: HTMLCanvasElement,
    filename: string,
    targetSizeKB: number = this.TARGET_SIZE_KB,
  ): Promise<void> {
    const result = await this.optimizeForSize(canvas, targetSizeKB)

    // Create download link
    const url = URL.createObjectURL(result.blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}.${result.format}`

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Cleanup
    URL.revokeObjectURL(url)

    console.log(`Downloaded ${filename}.${result.format} (${result.sizeKB}KB, ${result.quality * 100}% quality)`)
  }
}
