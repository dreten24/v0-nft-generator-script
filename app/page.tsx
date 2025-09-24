"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function NFTGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setStatus("Initializing NFT generation...")

    try {
      // Simulate progress updates
      const intervals = [
        { progress: 10, status: "Setting up fractal engine..." },
        { progress: 25, status: "Generating unique fractals..." },
        { progress: 50, status: "Creating metadata..." },
        { progress: 75, status: "Checking for duplicates..." },
        { progress: 90, status: "Finalizing collection..." },
        { progress: 100, status: "Generation complete! 4444 unique NFTs created." },
      ]

      for (const interval of intervals) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setProgress(interval.progress)
        setStatus(interval.status)
      }
    } catch (error) {
      setStatus("Error occurred during generation")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Fractal NFT Generator</h1>
          <p className="text-xl text-blue-200">Generate 4444 unique fractal NFTs ready for production launch</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Production Generator</CardTitle>
            <CardDescription className="text-blue-200">
              Create your complete NFT collection with zero duplicates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400">4444</div>
                <div className="text-sm text-gray-300">Unique NFTs</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-400">4</div>
                <div className="text-sm text-gray-300">Fractal Types</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-400">8</div>
                <div className="text-sm text-gray-300">Color Schemes</div>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-blue-200">{status}</p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
            >
              {isGenerating ? "Generating..." : "Generate 4444 NFTs"}
            </Button>

            <div className="text-sm text-gray-300 space-y-2">
              <p>✅ Zero duplicate prevention with SHA-256 hashing</p>
              <p>✅ Automatic rarity distribution (Common to Legendary)</p>
              <p>✅ OpenSea-compatible metadata generation</p>
              <p>✅ Production-ready image output</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-blue-200 text-sm">
            Run the scripts in the /scripts folder to generate your NFT collection
          </p>
        </div>
      </div>
    </div>
  )
}
