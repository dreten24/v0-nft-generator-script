"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { FractalCanvas } from "./fractal-canvas"
import { generateUniqueOrganism, type GeologicEra } from "@/lib/geologic-eras"

interface OrganismPreviewProps {
  era: GeologicEra
  onMint: (organism: any) => void
  isMinting: boolean
}

export function OrganismPreview({ era, onMint, isMinting }: OrganismPreviewProps) {
  const [currentOrganism, setCurrentOrganism] = useState<any>(null)
  const [fractalDepth, setFractalDepth] = useState([5])
  const [complexity, setComplexity] = useState([0.7])
  const [colorIntensity, setColorIntensity] = useState([0.8])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRandomOrganism = () => {
    setIsGenerating(true)

    // Simulate generation time for better UX
    setTimeout(() => {
      const randomTokenId = Math.floor(Math.random() * 1000000) + 1
      const organism = generateUniqueOrganism(era.id, randomTokenId)

      // Convert to display format
      const displayOrganism = {
        id: organism.uniqueId,
        name: organism.name,
        colors: era.colors,
        ...organism,
      }

      setCurrentOrganism(displayOrganism)
      setIsGenerating(false)
    }, 1500)
  }

  useEffect(() => {
    generateRandomOrganism()
  }, [era])

  if (!currentOrganism) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fractal Preview */}
          <div className="space-y-4">
            <div className="aspect-square bg-black rounded-lg overflow-hidden">
              <FractalCanvas
                organism={currentOrganism}
                depth={fractalDepth[0]}
                complexity={complexity[0]}
                colorIntensity={colorIntensity[0]}
                isGenerating={isGenerating}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={generateRandomOrganism}
                disabled={isGenerating}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                {isGenerating ? "Generating..." : "New Random"}
              </Button>
              <Button onClick={() => onMint(currentOrganism)} disabled={isMinting} className="flex-1">
                {isMinting ? "Minting..." : "Mint for 44 DOGE"}
              </Button>
            </div>
          </div>

          {/* Controls and Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{currentOrganism.name}</h3>
              <p className="text-muted-foreground">
                From the {era.name} era ({era.yearsAgo})
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{currentOrganism.type}</Badge>
                <Badge variant="outline">{currentOrganism.size}</Badge>
                <Badge variant="outline">{currentOrganism.rarity}</Badge>
                <Badge variant="outline">{currentOrganism.fractalPattern}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fractal Depth: {fractalDepth[0]}</label>
                <Slider
                  value={fractalDepth}
                  onValueChange={setFractalDepth}
                  min={2}
                  max={8}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Complexity: {complexity[0].toFixed(2)}</label>
                <Slider
                  value={complexity}
                  onValueChange={setComplexity}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color Intensity: {colorIntensity[0].toFixed(2)}</label>
                <Slider
                  value={colorIntensity}
                  onValueChange={setColorIntensity}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Traits</h4>
              <div className="flex flex-wrap gap-1">
                {currentOrganism.traits.map((trait: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Token ID:</strong> {currentOrganism.tokenId}
              </p>
              <p>
                <strong>Fractal Seed:</strong> {currentOrganism.fractalSeed}
              </p>
              <p>
                <strong>Complexity:</strong> {Math.round(currentOrganism.complexity * 100)}%
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
