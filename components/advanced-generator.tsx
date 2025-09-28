"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Shuffle, Play, Pause, RotateCcw, Layers } from "lucide-react"

interface TraitCustomization {
  fractalPattern: string
  colorScheme: string
  complexity: number
  symmetry: string
  texture: string
  animation: boolean
  fossilEffect: boolean
  hybridEra?: string
}

interface GenerationPreset {
  name: string
  description: string
  traits: Partial<TraitCustomization>
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
}

const generationPresets: GenerationPreset[] = [
  {
    name: "Classic Fractal",
    description: "Traditional recursive patterns with balanced complexity",
    traits: { fractalPattern: "spiral", complexity: 50, symmetry: "radial" },
    rarity: "Common",
  },
  {
    name: "Fossil Variant",
    description: "Aged appearance with weathered textures",
    traits: { fossilEffect: true, texture: "weathered", colorScheme: "sepia" },
    rarity: "Uncommon",
  },
  {
    name: "Animated Fractal",
    description: "Living patterns that slowly rotate and zoom",
    traits: { animation: true, fractalPattern: "branching", complexity: 75 },
    rarity: "Rare",
  },
  {
    name: "Cross-Era Hybrid",
    description: "Unique combinations spanning multiple geological eras",
    traits: { hybridEra: "mixed", complexity: 90, symmetry: "bilateral" },
    rarity: "Epic",
  },
  {
    name: "Legendary Genesis",
    description: "Ultra-rare with maximum complexity and special effects",
    traits: {
      animation: true,
      fossilEffect: true,
      complexity: 100,
      fractalPattern: "ultra-complex",
      hybridEra: "all",
    },
    rarity: "Legendary",
  },
]

const fractalPatterns = ["spiral", "radial", "bilateral", "branching", "crystalline", "organic", "ultra-complex"]

const colorSchemes = ["oceanic", "volcanic", "forest", "desert", "arctic", "cosmic", "sepia", "monochrome"]

const symmetryTypes = ["radial", "bilateral", "rotational", "translational", "fractal", "asymmetric"]

const textureTypes = ["smooth", "rough", "crystalline", "organic", "weathered", "metallic", "ethereal"]

export default function AdvancedGenerator() {
  const [customization, setCustomization] = useState<TraitCustomization>({
    fractalPattern: "spiral",
    colorScheme: "oceanic",
    complexity: 50,
    symmetry: "radial",
    texture: "smooth",
    animation: false,
    fossilEffect: false,
  })

  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [animationPlaying, setAnimationPlaying] = useState(false)
  const [generationHistory, setGenerationHistory] = useState<TraitCustomization[]>([])

  const handlePresetSelect = (presetName: string) => {
    const preset = generationPresets.find((p) => p.name === presetName)
    if (preset) {
      setCustomization((prev) => ({ ...prev, ...preset.traits }))
      setSelectedPreset(presetName)
    }
  }

  const handleRandomize = () => {
    const randomCustomization: TraitCustomization = {
      fractalPattern: fractalPatterns[Math.floor(Math.random() * fractalPatterns.length)],
      colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)],
      complexity: Math.floor(Math.random() * 100) + 1,
      symmetry: symmetryTypes[Math.floor(Math.random() * symmetryTypes.length)],
      texture: textureTypes[Math.floor(Math.random() * textureTypes.length)],
      animation: Math.random() > 0.7,
      fossilEffect: Math.random() > 0.8,
      hybridEra: Math.random() > 0.9 ? "mixed" : undefined,
    }
    setCustomization(randomCustomization)
    setSelectedPreset("")
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Add to history
    setGenerationHistory((prev) => [customization, ...prev.slice(0, 9)])

    // Simulate generation process
    setTimeout(() => {
      const baseUrl = customization.animation
        ? "/animated-fractal-organism-with-recursive-patterns.gif"
        : "/fractal-organism-with-recursive-patterns.jpg"

      setPreviewUrl(baseUrl)
      setIsGenerating(false)
    }, 3000)
  }

  const getRarityFromCustomization = (traits: TraitCustomization): string => {
    let rarityScore = 0

    if (traits.animation) rarityScore += 30
    if (traits.fossilEffect) rarityScore += 20
    if (traits.hybridEra) rarityScore += 40
    if (traits.complexity > 80) rarityScore += 25
    if (traits.fractalPattern === "ultra-complex") rarityScore += 35

    if (rarityScore >= 100) return "Legendary"
    if (rarityScore >= 70) return "Epic"
    if (rarityScore >= 40) return "Rare"
    if (rarityScore >= 20) return "Uncommon"
    return "Common"
  }

  const rarityColors = {
    Common: "bg-gray-500",
    Uncommon: "bg-green-500",
    Rare: "bg-blue-500",
    Epic: "bg-purple-500",
    Legendary: "bg-yellow-500",
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Advanced Generator
        </h2>
        <p className="text-muted-foreground">
          Create custom fractals with advanced traits, animations, and cross-era hybrids
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generationPresets.map((preset) => (
                  <Card
                    key={preset.name}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPreset === preset.name ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handlePresetSelect(preset.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{preset.name}</h3>
                        <Badge className={`${rarityColors[preset.rarity]} text-white`}>{preset.rarity}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{preset.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fractal Pattern</label>
                    <Select
                      value={customization.fractalPattern}
                      onValueChange={(value) => setCustomization((prev) => ({ ...prev, fractalPattern: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fractalPatterns.map((pattern) => (
                          <SelectItem key={pattern} value={pattern}>
                            {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Color Scheme</label>
                    <Select
                      value={customization.colorScheme}
                      onValueChange={(value) => setCustomization((prev) => ({ ...prev, colorScheme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorSchemes.map((scheme) => (
                          <SelectItem key={scheme} value={scheme}>
                            {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Symmetry Type</label>
                    <Select
                      value={customization.symmetry}
                      onValueChange={(value) => setCustomization((prev) => ({ ...prev, symmetry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {symmetryTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Texture</label>
                    <Select
                      value={customization.texture}
                      onValueChange={(value) => setCustomization((prev) => ({ ...prev, texture: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {textureTypes.map((texture) => (
                          <SelectItem key={texture} value={texture}>
                            {texture.charAt(0).toUpperCase() + texture.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Complexity: {customization.complexity}%</label>
                    <Slider
                      value={[customization.complexity]}
                      onValueChange={([value]) => setCustomization((prev) => ({ ...prev, complexity: value }))}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Animation</label>
                      <Switch
                        checked={customization.animation}
                        onCheckedChange={(checked) => setCustomization((prev) => ({ ...prev, animation: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Fossil Effect</label>
                      <Switch
                        checked={customization.fossilEffect}
                        onCheckedChange={(checked) => setCustomization((prev) => ({ ...prev, fossilEffect: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Cross-Era Hybrid</label>
                      <Switch
                        checked={!!customization.hybridEra}
                        onCheckedChange={(checked) =>
                          setCustomization((prev) => ({
                            ...prev,
                            hybridEra: checked ? "mixed" : undefined,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Predicted Rarity</span>
                      <Badge
                        className={`${rarityColors[getRarityFromCustomization(customization) as keyof typeof rarityColors]} text-white`}
                      >
                        {getRarityFromCustomization(customization)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {generationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No generation history yet. Create some fractals to see them here!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generationHistory.map((traits, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setCustomization(traits)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Generation #{index + 1}</span>
                          <Badge
                            className={`${rarityColors[getRarityFromCustomization(traits) as keyof typeof rarityColors]} text-white`}
                          >
                            {getRarityFromCustomization(traits)}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Pattern: {traits.fractalPattern}</div>
                          <div>Complexity: {traits.complexity}%</div>
                          <div className="flex gap-2">
                            {traits.animation && (
                              <Badge variant="outline" className="text-xs">
                                Animated
                              </Badge>
                            )}
                            {traits.fossilEffect && (
                              <Badge variant="outline" className="text-xs">
                                Fossil
                              </Badge>
                            )}
                            {traits.hybridEra && (
                              <Badge variant="outline" className="text-xs">
                                Hybrid
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button onClick={handleRandomize} variant="outline" className="flex-1 bg-transparent">
              <Shuffle className="w-4 h-4 mr-2" />
              Randomize
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Preview</span>
                {customization.animation && previewUrl && (
                  <Button size="sm" variant="outline" onClick={() => setAnimationPlaying(!animationPlaying)}>
                    {animationPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Generated fractal preview"
                    className={`w-full h-full object-cover ${
                      customization.animation && !animationPlaying ? "opacity-50" : ""
                    }`}
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Generate a fractal to see preview</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Traits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Pattern:</span>
                  <div className="font-medium">{customization.fractalPattern}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Colors:</span>
                  <div className="font-medium">{customization.colorScheme}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Symmetry:</span>
                  <div className="font-medium">{customization.symmetry}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Texture:</span>
                  <div className="font-medium">{customization.texture}</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-1">Complexity</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${customization.complexity}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{customization.complexity}%</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {customization.animation && (
                  <Badge variant="secondary" className="text-xs">
                    <Play className="w-3 h-3 mr-1" />
                    Animated
                  </Badge>
                )}
                {customization.fossilEffect && (
                  <Badge variant="secondary" className="text-xs">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Fossil
                  </Badge>
                )}
                {customization.hybridEra && (
                  <Badge variant="secondary" className="text-xs">
                    <Layers className="w-3 h-3 mr-1" />
                    Hybrid
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
