"use client"

import { useRef, useEffect } from "react"

interface FractalCanvasProps {
  organism: {
    id: string
    name: string
    colors: string[]
  }
  depth: number
  complexity: number
  colorIntensity: number
  isGenerating: boolean
}

export function FractalCanvas({ organism, depth, complexity, colorIntensity, isGenerating }: FractalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || isGenerating) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size for high DPI displays
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)
    canvas.style.width = rect.width + "px"
    canvas.style.height = rect.height + "px"

    // Clear and draw
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Add subtle background
    const gradient = ctx.createRadialGradient(
      rect.width / 2,
      rect.height / 2,
      0,
      rect.width / 2,
      rect.height / 2,
      rect.width / 2,
    )
    gradient.addColorStop(0, "oklch(0.05 0 0)")
    gradient.addColorStop(1, "oklch(0.02 0 0)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Draw preview fractal
    drawPreviewFractal(
      ctx,
      rect.width / 2,
      rect.height / 2,
      Math.min(rect.width, rect.height) * 0.3,
      organism,
      depth,
      complexity,
      colorIntensity,
    )
  }, [organism, depth, complexity, colorIntensity, isGenerating])

  const drawPreviewFractal = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    size: number,
    organism: FractalCanvasProps["organism"],
    depth: number,
    complexity: number,
    colorIntensity: number,
  ) => {
    // Simple preview version of the fractal
    const drawLevel = (x: number, y: number, currentSize: number, level: number, rotation: number) => {
      if (level <= 0 || currentSize < 5) return

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      const alpha = Math.min(1, level / depth) * colorIntensity
      const color = organism.colors[level % organism.colors.length]

      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.shadowColor = color
      ctx.shadowBlur = currentSize * 0.1

      // Simple shape based on organism
      switch (organism.id) {
        case "butterfly":
          ctx.fillRect(-currentSize * 0.4, -currentSize * 0.4, currentSize * 0.8, currentSize * 0.8)
          break
        case "jellyfish":
          ctx.beginPath()
          ctx.arc(0, 0, currentSize * 0.4, 0, Math.PI * 2)
          ctx.fill()
          break
        default:
          ctx.beginPath()
          ctx.arc(0, 0, currentSize * 0.3, 0, Math.PI * 2)
          ctx.fill()
      }

      ctx.restore()

      // Recursive calls
      const newSize = currentSize * (0.4 + complexity * 0.2)
      const distance = currentSize * (0.8 + complexity * 0.4)

      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2
        drawLevel(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, newSize, level - 1, rotation + angle)
      }
    }

    drawLevel(centerX, centerY, size, depth, 0)
  }

  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" style={{ background: "transparent" }} />
}
