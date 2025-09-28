"use client"

import { ImageOptimizer } from "@/lib/image-optimizer"
import { useRef, useState } from "react"
import { toast } from "react-toastify"

const NFTGenerator = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const selectedOrganism = { name: "OrganismName" } // Example declaration, replace with actual logic

  const handleDownload = async () => {
    if (!canvasRef.current) return

    try {
      setIsGenerating(true)

      // Optimize image for 8KB target
      const result = await ImageOptimizer.optimizeForSize(canvasRef.current, 8)

      // Create download
      const url = URL.createObjectURL(result.blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `prehistoric-fractal-${selectedOrganism.name}-${Date.now()}.${result.format}`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Show optimization results
      toast({
        title: "Download Complete!",
        description: `Optimized to ${result.sizeKB}KB (${result.format.toUpperCase()}, ${Math.round(result.quality * 100)}% quality)`,
      })
    } catch (error) {
      console.error("Download failed:", error)
      toast({
        title: "Download Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      {/* ... existing JSX code ... */}

      {/* Added optimization info display */}
      <div className="text-sm text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>Target Size:</span>
          <span className="font-mono">≤ 8KB</span>
        </div>
        <div className="flex justify-between">
          <span>Dimensions:</span>
          <span className="font-mono">512×512</span>
        </div>
        <div className="flex justify-between">
          <span>Formats:</span>
          <span className="font-mono">WebP/JPEG/PNG</span>
        </div>
      </div>

      {/* ... existing JSX code ... */}
    </div>
  )
}

export default NFTGenerator
