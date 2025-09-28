"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface CompressionStats {
  totalGenerated: number
  under8kb: number
  averageSizeKb: number
  successRate: number
  totalSizeMb: number
}

export function SizeOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState<CompressionStats | null>(null)

  const runOptimization = async () => {
    setIsOptimizing(true)
    setProgress(0)

    try {
      const response = await fetch("/api/optimize-sizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetSizeKb: 8 }),
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n").filter((line) => line.trim())

          for (const line of lines) {
            try {
              const data = JSON.parse(line)
              if (data.progress) {
                setProgress(data.progress)
              }
              if (data.stats) {
                setStats(data.stats)
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Optimization failed:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🗜️</span>
          Size Optimizer
        </CardTitle>
        <CardDescription>
          Optimize all 4444 NFT images to be under 8KB while maintaining artistic quality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium">Target Specifications:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Max file size: 8KB</li>
                <li>• Dimensions: 512×512px</li>
                <li>• Format: PNG/WebP/JPEG</li>
                <li>• Quality: High (artistic)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-medium">Optimization Methods:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Palette quantization</li>
                <li>• Smart compression</li>
                <li>• Format selection</li>
                <li>• Dimension scaling</li>
              </ul>
            </div>
          </div>

          {isOptimizing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Optimizing images...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <div className="text-sm font-medium">Results</div>
                <div className="space-y-1 text-sm">
                  <div>
                    Success Rate: <Badge variant="secondary">{stats.successRate}%</Badge>
                  </div>
                  <div>
                    Average Size: <Badge variant="outline">{stats.averageSizeKb}KB</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Collection Stats</div>
                <div className="space-y-1 text-sm">
                  <div>
                    Under 8KB: <Badge variant="secondary">{stats.under8kb}/4444</Badge>
                  </div>
                  <div>
                    Total Size: <Badge variant="outline">{stats.totalSizeMb}MB</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button onClick={runOptimization} disabled={isOptimizing} className="w-full">
            {isOptimizing ? "Optimizing..." : "Start Size Optimization"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
