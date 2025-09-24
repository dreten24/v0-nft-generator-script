import { createCanvas, type CanvasRenderingContext2D } from "canvas"

export interface FractalConfig {
  width: number
  height: number
  iterations: number
  zoom: number
  centerX: number
  centerY: number
  colorScheme: string[]
  fractalType: "mandelbrot" | "julia" | "burning_ship" | "tricorn"
  juliaC?: { real: number; imag: number }
  quality: number
  compressionLevel: number
}

export class FractalGenerator {
  private canvas: any
  private ctx: CanvasRenderingContext2D

  constructor(private config: FractalConfig) {
    this.canvas = createCanvas(config.width, config.height)
    this.ctx = this.canvas.getContext("2d")
  }

  // Mandelbrot set calculation
  private mandelbrot(x: number, y: number): number {
    let real = x
    let imag = y
    let iterations = 0

    while (iterations < this.config.iterations) {
      const realTemp = real * real - imag * imag + x
      const imagTemp = 2 * real * imag + y

      real = realTemp
      imag = imagTemp

      if (real * real + imag * imag > 4) {
        break
      }
      iterations++
    }

    return iterations
  }

  // Julia set calculation
  private julia(x: number, y: number): number {
    const c = this.config.juliaC || { real: -0.7, imag: 0.27015 }
    let real = x
    let imag = y
    let iterations = 0

    while (iterations < this.config.iterations) {
      const realTemp = real * real - imag * imag + c.real
      const imagTemp = 2 * real * imag + c.imag

      real = realTemp
      imag = imagTemp

      if (real * real + imag * imag > 4) {
        break
      }
      iterations++
    }

    return iterations
  }

  // Burning Ship fractal
  private burningShip(x: number, y: number): number {
    let real = x
    let imag = y
    let iterations = 0

    while (iterations < this.config.iterations) {
      const realTemp = real * real - imag * imag + x
      const imagTemp = 2 * Math.abs(real * imag) + y

      real = realTemp
      imag = imagTemp

      if (real * real + imag * imag > 4) {
        break
      }
      iterations++
    }

    return iterations
  }

  // Tricorn fractal
  private tricorn(x: number, y: number): number {
    let real = x
    let imag = y
    let iterations = 0

    while (iterations < this.config.iterations) {
      const realTemp = real * real - imag * imag + x
      const imagTemp = -2 * real * imag + y

      real = realTemp
      imag = imagTemp

      if (real * real + imag * imag > 4) {
        break
      }
      iterations++
    }

    return iterations
  }

  private getIterations(x: number, y: number): number {
    switch (this.config.fractalType) {
      case "mandelbrot":
        return this.mandelbrot(x, y)
      case "julia":
        return this.julia(x, y)
      case "burning_ship":
        return this.burningShip(x, y)
      case "tricorn":
        return this.tricorn(x, y)
      default:
        return this.mandelbrot(x, y)
    }
  }

  private getColor(iterations: number): string {
    if (iterations === this.config.iterations) {
      return "#000000" // Inside the set
    }

    const colorIndex = iterations % this.config.colorScheme.length
    const baseColor = this.config.colorScheme[colorIndex]

    // Add some variation based on iteration count
    const intensity = Math.min(255, Math.floor((iterations / this.config.iterations) * 255))

    // Parse hex color and adjust intensity
    const r = Number.parseInt(baseColor.slice(1, 3), 16)
    const g = Number.parseInt(baseColor.slice(3, 5), 16)
    const b = Number.parseInt(baseColor.slice(5, 7), 16)

    const adjustedR = Math.floor((r * intensity) / 255)
    const adjustedG = Math.floor((g * intensity) / 255)
    const adjustedB = Math.floor((b * intensity) / 255)

    return `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`
  }

  generateFractal(): Buffer {
    const imageData = this.ctx.createImageData(this.config.width, this.config.height)
    const data = imageData.data

    const step = this.config.width > 256 ? 2 : 1 // Skip pixels for larger images

    for (let py = 0; py < this.config.height; py += step) {
      for (let px = 0; px < this.config.width; px += step) {
        // Map pixel coordinates to complex plane
        const x = (px - this.config.width / 2) / ((this.config.zoom * this.config.width) / 4) + this.config.centerX
        const y = (py - this.config.height / 2) / ((this.config.zoom * this.config.height) / 4) + this.config.centerY

        const iterations = this.getIterations(x, y)
        const color = this.getColor(iterations)

        // Parse RGB color
        const rgbMatch = color.match(/rgb$$(\d+), (\d+), (\d+)$$/)
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number)

          for (let dy = 0; dy < step && py + dy < this.config.height; dy++) {
            for (let dx = 0; dx < step && px + dx < this.config.width; dx++) {
              const index = ((py + dy) * this.config.width + (px + dx)) * 4
              data[index] = r // Red
              data[index + 1] = g // Green
              data[index + 2] = b // Blue
              data[index + 3] = 255 // Alpha
            }
          }
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0)

    return this.generateOptimizedBuffer()
  }

  private generateOptimizedBuffer(): Buffer {
    let buffer: Buffer
    let quality = this.config.quality || 0.7

    // Try PNG first (better for fractals)
    buffer = this.canvas.toBuffer("image/png", { compressionLevel: this.config.compressionLevel || 9 })

    // If PNG is too large, try JPEG with quality adjustment
    if (buffer.length > 5120) {
      // 5KB = 5120 bytes
      let attempts = 0
      while (buffer.length > 5120 && quality > 0.1 && attempts < 10) {
        quality -= 0.1
        buffer = this.canvas.toBuffer("image/jpeg", { quality })
        attempts++
      }
    }

    return buffer
  }

  static generateUniqueConfig(seed: number): FractalConfig {
    // Use seed for deterministic randomness
    const random = (min: number, max: number) => {
      seed = (seed * 9301 + 49297) % 233280
      return min + (seed / 233280) * (max - min)
    }

    const fractalTypes: FractalConfig["fractalType"][] = ["mandelbrot", "julia", "burning_ship", "tricorn"]
    const colorSchemes = [
      ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
      ["#6C5CE7", "#A29BFE", "#FD79A8", "#FDCB6E", "#E17055"],
      ["#00B894", "#00CEC9", "#0984E3", "#6C5CE7", "#A29BFE"],
      ["#E84393", "#FD79A8", "#FDCB6E", "#E17055", "#D63031"],
      ["#74B9FF", "#0984E3", "#00B894", "#00CEC9", "#55A3FF"],
      ["#FF7675", "#FD79A8", "#FDCB6E", "#55EFC4", "#74B9FF"],
      ["#A29BFE", "#6C5CE7", "#FD79A8", "#FF7675", "#74B9FF"],
      ["#00CEC9", "#55EFC4", "#FDCB6E", "#FF7675", "#A29BFE"],
    ]

    const fractalType = fractalTypes[Math.floor(random(0, fractalTypes.length))]
    const colorScheme = colorSchemes[Math.floor(random(0, colorSchemes.length))]

    const width = Math.floor(random(0, 1)) > 0.7 ? 512 : 256 // Mostly 256x256 for smaller files
    const height = width // Keep square

    return {
      width,
      height,
      iterations: Math.floor(random(30, 150)), // Reduced max iterations for smaller files
      zoom: random(0.5, 3.0),
      centerX: random(-2, 2),
      centerY: random(-2, 2),
      colorScheme,
      fractalType,
      juliaC:
        fractalType === "julia"
          ? {
              real: random(-1, 1),
              imag: random(-1, 1),
            }
          : undefined,
      quality: random(0.6, 0.8),
      compressionLevel: 9,
    }
  }
}
