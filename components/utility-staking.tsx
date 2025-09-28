"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, Heart, Download, Printer, Box, Clock, Zap, Star, TrendingUp, Gift } from "lucide-react"

interface StakedNFT {
  tokenId: number
  organism: string
  era: string
  rarity: string
  stakedAt: Date
  rewardsEarned: number
  dailyRate: number
}

interface BreedingPair {
  parent1: number
  parent2: number
  offspring?: number
  breedingTime: Date
  isComplete: boolean
  traits: string[]
}

const rarityMultipliers = {
  Common: 1.0,
  Uncommon: 1.5,
  Rare: 2.0,
  Epic: 3.0,
  Legendary: 5.0,
}

export default function UtilityStaking() {
  const [stakedNFTs, setStakedNFTs] = useState<StakedNFT[]>([])
  const [availableNFTs, setAvailableNFTs] = useState<any[]>([])
  const [breedingPairs, setBreedingPairs] = useState<BreedingPair[]>([])
  const [totalRewards, setTotalRewards] = useState(0)
  const [selectedForBreeding, setSelectedForBreeding] = useState<number[]>([])
  const [exportFormat, setExportFormat] = useState<"3D" | "Print">("3D")

  useEffect(() => {
    // Mock data initialization
    const mockAvailableNFTs = Array.from({ length: 8 }, (_, i) => ({
      tokenId: i + 1,
      organism: ["Trilobite", "Ammonite", "T-Rex", "Mammoth"][Math.floor(Math.random() * 4)],
      era: ["Paleozoic", "Mesozoic", "Cenozoic"][Math.floor(Math.random() * 3)],
      rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"][Math.floor(Math.random() * 5)],
      imageUrl: `/fractal-${["butterfly", "jellyfish", "coral"][Math.floor(Math.random() * 3)]}-with-recursive-patterns.jpg`,
    }))

    setAvailableNFTs(mockAvailableNFTs)

    // Mock staked NFTs
    const mockStakedNFTs: StakedNFT[] = [
      {
        tokenId: 101,
        organism: "Trilobite",
        era: "Paleozoic",
        rarity: "Rare",
        stakedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        rewardsEarned: 14.5,
        dailyRate: 2.0,
      },
      {
        tokenId: 102,
        organism: "T-Rex",
        era: "Mesozoic",
        rarity: "Epic",
        stakedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        rewardsEarned: 9.0,
        dailyRate: 3.0,
      },
    ]

    setStakedNFTs(mockStakedNFTs)
    setTotalRewards(mockStakedNFTs.reduce((sum, nft) => sum + nft.rewardsEarned, 0))

    // Mock breeding pairs
    setBreedingPairs([
      {
        parent1: 201,
        parent2: 202,
        breedingTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        isComplete: false,
        traits: ["Spiral Pattern", "Oceanic Colors", "High Complexity"],
      },
    ])
  }, [])

  const handleStake = (tokenId: number) => {
    const nft = availableNFTs.find((n) => n.tokenId === tokenId)
    if (!nft) return

    const dailyRate = rarityMultipliers[nft.rarity as keyof typeof rarityMultipliers] * 1.0

    const stakedNFT: StakedNFT = {
      tokenId: nft.tokenId,
      organism: nft.organism,
      era: nft.era,
      rarity: nft.rarity,
      stakedAt: new Date(),
      rewardsEarned: 0,
      dailyRate,
    }

    setStakedNFTs((prev) => [...prev, stakedNFT])
    setAvailableNFTs((prev) => prev.filter((n) => n.tokenId !== tokenId))
  }

  const handleUnstake = (tokenId: number) => {
    const stakedNFT = stakedNFTs.find((n) => n.tokenId === tokenId)
    if (!stakedNFT) return

    // Return to available NFTs
    setAvailableNFTs((prev) => [
      ...prev,
      {
        tokenId: stakedNFT.tokenId,
        organism: stakedNFT.organism,
        era: stakedNFT.era,
        rarity: stakedNFT.rarity,
        imageUrl: `/fractal-organism-with-recursive-patterns.jpg`,
      },
    ])

    setStakedNFTs((prev) => prev.filter((n) => n.tokenId !== tokenId))
    setTotalRewards((prev) => prev + stakedNFT.rewardsEarned)
  }

  const handleClaimRewards = () => {
    const totalToClaim = stakedNFTs.reduce((sum, nft) => sum + nft.rewardsEarned, 0)
    setTotalRewards((prev) => prev + totalToClaim)

    // Reset earned rewards for staked NFTs
    setStakedNFTs((prev) => prev.map((nft) => ({ ...nft, rewardsEarned: 0 })))
  }

  const handleBreedingSelect = (tokenId: number) => {
    if (selectedForBreeding.includes(tokenId)) {
      setSelectedForBreeding((prev) => prev.filter((id) => id !== tokenId))
    } else if (selectedForBreeding.length < 2) {
      setSelectedForBreeding((prev) => [...prev, tokenId])
    }
  }

  const handleStartBreeding = () => {
    if (selectedForBreeding.length !== 2) return

    const newBreedingPair: BreedingPair = {
      parent1: selectedForBreeding[0],
      parent2: selectedForBreeding[1],
      breedingTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isComplete: false,
      traits: ["Hybrid Pattern", "Mixed Colors", "Enhanced Complexity"],
    }

    setBreedingPairs((prev) => [...prev, newBreedingPair])
    setSelectedForBreeding([])
  }

  const handleCompleteBreeding = (index: number) => {
    const newTokenId = 1000 + Math.floor(Math.random() * 1000)

    setBreedingPairs((prev) =>
      prev.map((pair, i) => (i === index ? { ...pair, isComplete: true, offspring: newTokenId } : pair)),
    )

    // Add new hybrid NFT to available
    setAvailableNFTs((prev) => [
      ...prev,
      {
        tokenId: newTokenId,
        organism: "Hybrid Organism",
        era: "Cross-Era",
        rarity: "Epic",
        imageUrl: "/fractal-hybrid-organism-with-recursive-patterns.jpg",
      },
    ])
  }

  const handleExport = (tokenId: number, format: "3D" | "Print") => {
    // Simulate export process
    const fileName = format === "3D" ? `prehistoric_fractal_${tokenId}.glb` : `prehistoric_fractal_${tokenId}_print.pdf`

    // In a real implementation, this would trigger a download
    alert(`Exporting ${fileName}...`)
  }

  const getDaysStaked = (stakedAt: Date) => {
    return Math.floor((Date.now() - stakedAt.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getBreedingTimeRemaining = (breedingTime: Date) => {
    const remaining = breedingTime.getTime() - Date.now()
    if (remaining <= 0) return "Ready!"

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return `${days}d ${hours}h`
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
          Utility & Staking Hub
        </h2>
        <p className="text-muted-foreground">Stake NFTs for rewards, breed new hybrids, and export for metaverse use</p>
      </div>

      {/* Rewards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalRewards.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Total Rewards (DOGE)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stakedNFTs.length}</div>
            <div className="text-sm text-muted-foreground">NFTs Staked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{breedingPairs.length}</div>
            <div className="text-sm text-muted-foreground">Breeding Pairs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {stakedNFTs.reduce((sum, nft) => sum + nft.dailyRate, 0).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Daily Rate (DOGE)</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staking" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="breeding">Breeding</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available NFTs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Box className="h-5 w-5" />
                  <span>Available NFTs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableNFTs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Box className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No NFTs available for staking</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableNFTs.map((nft) => (
                      <Card key={nft.tokenId} className="text-center">
                        <CardContent className="p-4">
                          <img
                            src={nft.imageUrl || "/placeholder.svg"}
                            alt={`${nft.organism} #${nft.tokenId}`}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold mb-1">
                            {nft.organism} #{nft.tokenId}
                          </h3>
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline">{nft.era}</Badge>
                            <Badge className={`${rarityColors[nft.rarity as keyof typeof rarityColors]} text-white`}>
                              {nft.rarity}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">
                            Daily Rate:{" "}
                            {(rarityMultipliers[nft.rarity as keyof typeof rarityMultipliers] * 1.0).toFixed(1)} DOGE
                          </div>
                          <Button size="sm" onClick={() => handleStake(nft.tokenId)} className="w-full">
                            <Coins className="w-4 h-4 mr-1" />
                            Stake
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Staked NFTs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Staked NFTs</span>
                  </div>
                  {stakedNFTs.length > 0 && (
                    <Button size="sm" onClick={handleClaimRewards}>
                      <Gift className="w-4 h-4 mr-1" />
                      Claim All
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stakedNFTs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No NFTs currently staked</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stakedNFTs.map((nft) => (
                      <Card key={nft.tokenId}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">
                                {nft.organism} #{nft.tokenId}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{nft.era}</Badge>
                                <Badge
                                  className={`${rarityColors[nft.rarity as keyof typeof rarityColors]} text-white`}
                                >
                                  {nft.rarity}
                                </Badge>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleUnstake(nft.tokenId)}>
                              Unstake
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Days Staked:</span>
                              <div className="font-semibold">{getDaysStaked(nft.stakedAt)}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Daily Rate:</span>
                              <div className="font-semibold">{nft.dailyRate} DOGE</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Earned:</span>
                              <div className="font-semibold text-green-600">{nft.rewardsEarned.toFixed(1)} DOGE</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breeding" className="space-y-6">
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              Breed two NFTs to create unique hybrid organisms with combined traits. Breeding takes 7 days and costs 10
              DOGE.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breeding Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Breeding Pair</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {availableNFTs.slice(0, 6).map((nft) => (
                    <Card
                      key={nft.tokenId}
                      className={`cursor-pointer transition-all ${
                        selectedForBreeding.includes(nft.tokenId) ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => handleBreedingSelect(nft.tokenId)}
                    >
                      <CardContent className="p-3 text-center">
                        <img
                          src={nft.imageUrl || "/placeholder.svg"}
                          alt={`${nft.organism} #${nft.tokenId}`}
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                        <div className="text-sm font-medium">
                          {nft.organism} #{nft.tokenId}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {nft.rarity}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Selected: {selectedForBreeding.length}/2</div>
                  <Button onClick={handleStartBreeding} disabled={selectedForBreeding.length !== 2} className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Start Breeding (10 DOGE)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Breeding */}
            <Card>
              <CardHeader>
                <CardTitle>Breeding Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {breedingPairs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No active breeding pairs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {breedingPairs.map((pair, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm">
                              <div className="font-medium">
                                #{pair.parent1} × #{pair.parent2}
                              </div>
                              <div className="text-muted-foreground">
                                {pair.isComplete ? "Complete!" : getBreedingTimeRemaining(pair.breedingTime)}
                              </div>
                            </div>
                            {pair.isComplete ? (
                              <Badge className="bg-green-500 text-white">Ready</Badge>
                            ) : (
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                Breeding
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Expected Traits:</div>
                            <div className="flex flex-wrap gap-1">
                              {pair.traits.map((trait, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {pair.isComplete ? (
                            <Button size="sm" className="w-full mt-3" onClick={() => handleCompleteBreeding(index)}>
                              Claim Offspring #{pair.offspring}
                            </Button>
                          ) : (
                            <Progress
                              value={Math.max(
                                0,
                                100 - ((pair.breedingTime.getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)) * 100,
                              )}
                              className="mt-3"
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              Export your NFTs as 3D models for metaverse use or high-resolution prints for physical collectibles.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Format</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${exportFormat === "3D" ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setExportFormat("3D")}
                  >
                    <CardContent className="p-4 text-center">
                      <Box className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">3D Model</div>
                      <div className="text-xs text-muted-foreground">GLB format for metaverse</div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all ${exportFormat === "Print" ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setExportFormat("Print")}
                  >
                    <CardContent className="p-4 text-center">
                      <Printer className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">Print Ready</div>
                      <div className="text-xs text-muted-foreground">High-res PDF/PNG</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">
                    {exportFormat === "3D" ? "3D Model Features:" : "Print Features:"}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {exportFormat === "3D" ? (
                      <>
                        <li>• Optimized for VR/AR platforms</li>
                        <li>• Compatible with major metaverses</li>
                        <li>• Animated fractal patterns</li>
                        <li>• PBR materials included</li>
                      </>
                    ) : (
                      <>
                        <li>• 300 DPI print resolution</li>
                        <li>• Multiple size options</li>
                        <li>• Color-accurate profiles</li>
                        <li>• Bleed margins included</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* NFT Selection for Export */}
            <Card>
              <CardHeader>
                <CardTitle>Select NFTs to Export</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[...availableNFTs, ...stakedNFTs].slice(0, 6).map((nft) => (
                    <Card key={nft.tokenId} className="text-center">
                      <CardContent className="p-3">
                        <img
                          src={nft.imageUrl || "/placeholder.svg"}
                          alt={`${nft.organism} #${nft.tokenId}`}
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                        <div className="text-sm font-medium mb-2">
                          {nft.organism} #{nft.tokenId}
                        </div>
                        <Button size="sm" onClick={() => handleExport(nft.tokenId, exportFormat)} className="w-full">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Rewards Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{totalRewards.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Total Claimed (DOGE)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stakedNFTs.reduce((sum, nft) => sum + nft.rewardsEarned, 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Rewards (DOGE)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {stakedNFTs.reduce((sum, nft) => sum + nft.dailyRate, 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Daily Earning Rate (DOGE)</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Rarity Multipliers</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(rarityMultipliers).map(([rarity, multiplier]) => (
                    <div key={rarity} className="text-center p-3 bg-muted rounded-lg">
                      <Badge className={`${rarityColors[rarity as keyof typeof rarityColors]} text-white mb-2`}>
                        {rarity}
                      </Badge>
                      <div className="font-semibold">{multiplier}x</div>
                      <div className="text-xs text-muted-foreground">multiplier</div>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <Star className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Bonus Rewards:</div>
                    <ul className="text-sm space-y-1">
                      <li>• Stake 5+ NFTs: +10% daily rate</li>
                      <li>• Stake for 30+ days: +20% daily rate</li>
                      <li>• Complete breeding: 50 DOGE bonus</li>
                      <li>• Export to 3D: 5 DOGE bonus</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
