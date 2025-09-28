"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Clock, Zap, Globe, Github } from "lucide-react"
import { EraSelector } from "@/components/era-selector"
import { OrganismPreview } from "@/components/organism-preview"
import { MintInterface } from "@/components/mint-interface"
import { OrganismGallery } from "@/components/organism-gallery"
import { GitHubDeployment } from "@/components/github-deployment"
import type { GeologicEra } from "@/lib/geologic-eras"

type AppState = "welcome" | "era-selection" | "preview" | "minting" | "gallery"

export default function PrehistoricFractalsApp() {
  const [appState, setAppState] = useState<AppState>("welcome")
  const [selectedEra, setSelectedEra] = useState<GeologicEra | null>(null)
  const [selectedOrganism, setSelectedOrganism] = useState<any>(null)
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null)
  const [showGitHubDeployment, setShowGitHubDeployment] = useState(false)

  const handleEraSelect = (era: GeologicEra) => {
    setSelectedEra(era)
  }

  const handleGeneratePreview = () => {
    if (selectedEra) {
      setAppState("preview")
    }
  }

  const handleMint = (organism: any) => {
    setSelectedOrganism(organism)
    setAppState("minting")
  }

  const handleMintComplete = (tokenId: number) => {
    setMintedTokenId(tokenId)
    setAppState("gallery")
  }

  const handleGitHubDeploy = () => {
    setShowGitHubDeployment(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-balance">Prehistoric Fractals</h1>
                <p className="text-xs text-muted-foreground">4444 Unique Organisms Across 7 Eras</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Oct 1st Launch
              </Badge>
              <Badge variant="secondary" className="text-xs">
                44 DOGE Each
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGitHubDeploy}
                className="hidden md:flex bg-transparent"
              >
                <Github className="w-4 h-4 mr-2" />
                Deploy to GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome State */}
        {appState === "welcome" && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Prehistoric Fractals
                </h2>
                <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
                  4444 unique artistic fractal organisms spanning 4.6 billion years of life on Earth. Each NFT features
                  recursive patterns perfect for social media avatars.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" onClick={() => setAppState("era-selection")} className="px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setAppState("gallery")}
                  className="px-8 bg-transparent"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">4444</div>
                <div className="text-sm text-muted-foreground">Unique Organisms</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">7</div>
                <div className="text-sm text-muted-foreground">Geologic Eras</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">44</div>
                <div className="text-sm text-muted-foreground">DOGE Price</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">1024</div>
                <div className="text-sm text-muted-foreground">Avatar Resolution</div>
              </Card>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Artistic Fractals</h3>
                  <p className="text-sm text-muted-foreground">
                    Not mathematical fractals, but artistic ones where zooming reveals more copies of the organism at
                    different scales.
                  </p>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">7 Geologic Eras</h3>
                  <p className="text-sm text-muted-foreground">
                    From Precambrian microbes to Cenozoic mammals, each era has authentic organisms with era-specific
                    aesthetics.
                  </p>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Avatar Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    High-resolution 1024×1024 output with Steve Jobs-level precision, perfect for X and Instagram.
                  </p>
                </div>
              </Card>
            </div>

            {/* Mint Progress */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Mint Progress</h3>
                  <Badge variant="outline">0 / 4444 Minted</Badge>
                </div>
                <Progress value={0} className="h-2" />
                <div className="text-center text-sm text-muted-foreground">
                  Minting begins October 1st, 2024 at 44 DOGE each
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Era Selection State */}
        {appState === "era-selection" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setAppState("welcome")} className="text-muted-foreground">
                ← Back to Home
              </Button>
            </div>

            <EraSelector
              selectedEra={selectedEra?.id || null}
              onEraSelect={handleEraSelect}
              onGeneratePreview={handleGeneratePreview}
              isGenerating={false}
            />
          </div>
        )}

        {/* Preview State */}
        {appState === "preview" && selectedEra && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setAppState("era-selection")} className="text-muted-foreground">
                ← Back to Era Selection
              </Button>
              <Badge variant="outline">{selectedEra.name} Era</Badge>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">{selectedEra.name} Organisms</h2>
              <p className="text-muted-foreground">{selectedEra.description}</p>
            </div>

            <OrganismPreview era={selectedEra} onMint={handleMint} isMinting={false} />
          </div>
        )}

        {/* Minting State */}
        {appState === "minting" && selectedOrganism && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setAppState("preview")} className="text-muted-foreground">
                ← Back to Preview
              </Button>
            </div>

            <div className="max-w-2xl mx-auto">
              <MintInterface organism={selectedOrganism} onMintComplete={handleMintComplete} />
            </div>
          </div>
        )}

        {/* Gallery State */}
        {appState === "gallery" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setAppState("welcome")} className="text-muted-foreground">
                ← Back to Home
              </Button>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Fractal Gallery</h2>
              <p className="text-muted-foreground">Explore sample fractals from across the geologic eras</p>
            </div>

            {mintedTokenId && (
              <Card className="p-6 text-center space-y-4 bg-primary/5 border-primary/20">
                <div className="text-2xl">🎉</div>
                <h3 className="text-xl font-bold">Congratulations!</h3>
                <p className="text-muted-foreground">
                  Your Prehistoric Fractal #{mintedTokenId} has been minted successfully!
                </p>
                <Button onClick={() => setAppState("welcome")} className="mt-4">
                  Create Another
                </Button>
              </Card>
            )}

            <OrganismGallery />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-semibold">Prehistoric Fractals</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Artistic fractal NFTs celebrating 4.6 billion years of life on Earth.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Collection</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Total Supply: 4444</p>
                <p>Mint Price: 44 DOGE</p>
                <p>Launch: October 1st, 2024</p>
                <p>Resolution: 1024×1024</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Features</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 7 Geologic Eras</p>
                <p>• Artistic Fractal Patterns</p>
                <p>• Avatar-Ready Quality</p>
                <p>• Deterministic Generation</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>Built with Steve Jobs-level precision for the NFT community</p>
          </div>
        </div>
      </footer>

      {/* GitHub Deployment Modal */}
      {showGitHubDeployment && <GitHubDeployment onClose={() => setShowGitHubDeployment(false)} />}
    </div>
  )
}
