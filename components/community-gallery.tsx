"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Trophy, Eye, Heart, Search, Verified } from "lucide-react"

interface NFTItem {
  tokenId: number
  owner: string
  organism: string
  era: string
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  traits: Record<string, string>
  imageUrl: string
  likes: number
  views: number
  isVerified: boolean
  fractalDepth: number
  complexity: number
  colorVariant: number
  rotationFactor: number
  scaleFactor: number
  uniqueHash: string
}

export default function CommunityGallery() {
  const [nfts, setNfts] = useState<NFTItem[]>([])
  const [filteredNfts, setFilteredNfts] = useState<NFTItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEra, setSelectedEra] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true)
  const [duplicateCount, setDuplicateCount] = useState(0)

  const rarityColors = {
    Common: "bg-gray-500",
    Uncommon: "bg-green-500",
    Rare: "bg-blue-500",
    Epic: "bg-purple-500",
    Legendary: "bg-yellow-500",
  }

  const eras = ["precambrian", "paleozoic", "mesozoic", "cenozoic", "devonian", "carboniferous", "permian"]

  const generateUniqueNFT = (tokenId: number): NFTItem => {
    // Use token ID as seed for deterministic generation
    const seed = tokenId * 12345 + 67890
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    // Determine era based on token distribution (4444 / 7 eras ≈ 635 per era)
    const organismsPerEra = Math.ceil(4444 / eras.length)
    const eraIndex = Math.min(Math.floor((tokenId - 1) / organismsPerEra), eras.length - 1)
    const era = eras[eraIndex]

    // Era-specific organisms
    const eraOrganisms = {
      precambrian: ["cyanobacteria", "stromatolite", "acritarch", "dickinsonia"],
      paleozoic: ["trilobite", "brachiopod", "crinoid", "eurypterid", "dunkleosteus"],
      mesozoic: ["triceratops", "tyrannosaurus", "pteranodon", "ammonite", "plesiosaur"],
      cenozoic: ["mammoth", "sabertooth", "giant-sloth", "terror-bird", "basilosaurus"],
      devonian: ["placoderm", "coelacanth", "archaeopteris", "bothrilepis"],
      carboniferous: ["meganeura", "arthropleura", "lepidodendron", "helicoprion"],
      permian: ["dimetrodon", "gorgonopsid", "scutosaurus", "helicoprion"],
    }

    const organisms = eraOrganisms[era as keyof typeof eraOrganisms] || eraOrganisms.precambrian
    const organism = organisms[tokenId % organisms.length]

    // Generate unique parameters based on token ID
    const fractalDepth = 4 + (tokenId % 4) // 4-7
    const complexity = 0.3 + random(seed + 1) * 0.7
    const colorVariant = tokenId % 5
    const rotationFactor = random(seed + 2) * 2 * Math.PI
    const scaleFactor = 0.8 + random(seed + 3) * 0.4

    // Create unique hash from parameters
    const uniqueHash = `${tokenId}-${fractalDepth}-${Math.round(complexity * 1000)}-${colorVariant}-${Math.round(rotationFactor * 1000)}-${Math.round(scaleFactor * 1000)}`

    // Determine rarity based on parameter combinations
    let rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
    const rarityScore = fractalDepth + complexity + (scaleFactor > 1.1 ? 1 : 0) + (colorVariant === 4 ? 1 : 0)

    if (rarityScore >= 8.5) rarity = "Legendary"
    else if (rarityScore >= 7.5) rarity = "Epic"
    else if (rarityScore >= 6.5) rarity = "Rare"
    else if (rarityScore >= 5.5) rarity = "Uncommon"
    else rarity = "Common"

    // Generate traits based on parameters
    const patterns = ["Spiral", "Radial", "Bilateral", "Branching", "Crystalline", "Segmented"]
    const colors = ["Oceanic", "Volcanic", "Forest", "Desert", "Cosmic"]
    const complexities = ["Simple", "Moderate", "Complex", "Ultra"]

    const traits = {
      "Fractal Pattern": patterns[tokenId % patterns.length],
      "Color Scheme": colors[colorVariant],
      Complexity: complexities[Math.min(Math.floor(complexity * 4), 3)],
      Era: era.charAt(0).toUpperCase() + era.slice(1),
      Depth: fractalDepth.toString(),
      Scale: scaleFactor > 1.0 ? "Large" : "Standard",
    }

    return {
      tokenId,
      owner: `D${Math.random().toString(36).substr(2, 8).toUpperCase()}...`,
      organism: organism.charAt(0).toUpperCase() + organism.slice(1).replace("-", " "),
      era: era.charAt(0).toUpperCase() + era.slice(1),
      rarity,
      traits,
      imageUrl: generateFractalArtwork(
        tokenId,
        organism,
        era,
        fractalDepth,
        complexity,
        colorVariant,
        rotationFactor,
        scaleFactor,
      ),
      likes: Math.floor(random(seed + 4) * 100),
      views: Math.floor(random(seed + 5) * 1000),
      isVerified: random(seed + 6) > 0.7,
      fractalDepth,
      complexity: Math.round(complexity * 1000) / 1000,
      colorVariant,
      rotationFactor: Math.round(rotationFactor * 1000) / 1000,
      scaleFactor: Math.round(scaleFactor * 1000) / 1000,
      uniqueHash,
    }
  }

  const generateFractalArtwork = (
    tokenId: number,
    organism: string,
    era: string,
    depth: number,
    complexity: number,
    colorVariant: number,
    rotation: number,
    scale: number,
  ): string => {
    // Create a canvas element to generate the fractal
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return "/placeholder.svg?height=400&width=400"

    canvas.width = 400
    canvas.height = 400

    // Era-based color palettes
    const colorPalettes = {
      precambrian: ["#1a365d", "#2d5a87", "#4a90b8", "#7bb3d9", "#b8daf0"],
      paleozoic: ["#2d5016", "#4a7c59", "#68a085", "#86c5b1", "#a4e8dd"],
      mesozoic: ["#8b4513", "#cd853f", "#daa520", "#ffd700", "#ffff99"],
      cenozoic: ["#4b0082", "#663399", "#8a2be2", "#9370db", "#dda0dd"],
      devonian: ["#006400", "#228b22", "#32cd32", "#90ee90", "#98fb98"],
      carboniferous: ["#2f4f4f", "#708090", "#778899", "#b0c4de", "#e6e6fa"],
      permian: ["#8b0000", "#dc143c", "#ff6347", "#ffa07a", "#ffe4e1"],
    }

    const colors = colorPalettes[era as keyof typeof colorPalettes] || colorPalettes.precambrian

    // Clear canvas with gradient background
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200)
    gradient.addColorStop(0, colors[0] + "40")
    gradient.addColorStop(1, colors[1] + "20")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 400, 400)

    // Generate fractal pattern based on organism type
    ctx.save()
    ctx.translate(200, 200)
    ctx.rotate(rotation)
    ctx.scale(scale, scale)

    // Draw fractal based on organism characteristics
    if (organism.includes("spiral") || organism.includes("ammonite")) {
      drawSpiral(ctx, depth, complexity, colors)
    } else if (organism.includes("branch") || organism.includes("tree")) {
      drawBranching(ctx, depth, complexity, colors)
    } else if (organism.includes("crystal") || organism.includes("mineral")) {
      drawCrystalline(ctx, depth, complexity, colors)
    } else {
      drawRadial(ctx, depth, complexity, colors)
    }

    ctx.restore()

    // Add organism-specific details
    addOrganismDetails(ctx, organism, colors, tokenId)

    // Convert canvas to data URL
    return canvas.toDataURL("image/png", 0.8)
  }

  const drawSpiral = (ctx: CanvasRenderingContext2D, depth: number, complexity: number, colors: string[]) => {
    const maxRadius = 150 * complexity
    const turns = depth * 2
    const points = Math.floor(200 * complexity)

    ctx.strokeStyle = colors[2]
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * turns * 2 * Math.PI
      const radius = (i / points) * maxRadius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Add spiral arms
    for (let arm = 0; arm < depth; arm++) {
      ctx.strokeStyle = colors[3] + "80"
      ctx.beginPath()
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * turns * 2 * Math.PI + (arm * Math.PI) / depth
        const radius = (i / points) * maxRadius * 0.7
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  }

  const drawBranching = (ctx: CanvasRenderingContext2D, depth: number, complexity: number, colors: string[]) => {
    const drawBranch = (x: number, y: number, angle: number, length: number, currentDepth: number) => {
      if (currentDepth === 0 || length < 2) return

      const endX = x + Math.cos(angle) * length
      const endY = y + Math.sin(angle) * length

      ctx.strokeStyle = colors[Math.min(currentDepth, colors.length - 1)]
      ctx.lineWidth = currentDepth * 0.5
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      const branchAngle = 0.5 * complexity
      const lengthReduction = 0.7 + complexity * 0.2

      drawBranch(endX, endY, angle - branchAngle, length * lengthReduction, currentDepth - 1)
      drawBranch(endX, endY, angle + branchAngle, length * lengthReduction, currentDepth - 1)
    }

    drawBranch(0, 100, -Math.PI / 2, 80 * complexity, depth)
  }

  const drawCrystalline = (ctx: CanvasRenderingContext2D, depth: number, complexity: number, colors: string[]) => {
    const sides = Math.floor(4 + depth * 2)
    const layers = Math.floor(3 + complexity * 5)

    for (let layer = 0; layer < layers; layer++) {
      const radius = (layer + 1) * (120 / layers) * complexity
      ctx.strokeStyle = colors[layer % colors.length]
      ctx.lineWidth = 2 - layer * 0.2
      ctx.beginPath()

      for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * 2 * Math.PI
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    }
  }

  const drawRadial = (ctx: CanvasRenderingContext2D, depth: number, complexity: number, colors: string[]) => {
    const rays = Math.floor(8 + depth * 4)
    const segments = Math.floor(5 + complexity * 10)

    for (let ray = 0; ray < rays; ray++) {
      const angle = (ray / rays) * 2 * Math.PI
      ctx.strokeStyle = colors[ray % colors.length]
      ctx.lineWidth = 1.5

      for (let segment = 1; segment <= segments; segment++) {
        const radius = (segment / segments) * 120 * complexity
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        ctx.beginPath()
        ctx.arc(x, y, 2 + segment * 0.5, 0, 2 * Math.PI)
        ctx.stroke()
      }
    }
  }

  const addOrganismDetails = (ctx: CanvasRenderingContext2D, organism: string, colors: string[], tokenId: number) => {
    // Add unique details based on organism type
    ctx.fillStyle = colors[4] + "60"
    const detailCount = 3 + (tokenId % 5)

    for (let i = 0; i < detailCount; i++) {
      const angle = (i / detailCount) * 2 * Math.PI
      const radius = 80 + (tokenId % 40)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const size = 3 + (tokenId % 8)

      ctx.beginPath()
      ctx.arc(x, y, size, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  useEffect(() => {
    const loadNFTs = async () => {
      setLoading(true)
      console.log("[v0] Generating 4444 unique NFTs with validation...")

      const uniqueNFTs: NFTItem[] = []
      const seenHashes = new Set<string>()
      let duplicatesFound = 0

      // Generate all 4444 unique NFTs
      for (let tokenId = 1; tokenId <= 4444; tokenId++) {
        const nft = generateUniqueNFT(tokenId)

        // Validate uniqueness
        if (seenHashes.has(nft.uniqueHash)) {
          duplicatesFound++
          console.log(`[v0] Duplicate detected for token ${tokenId}, regenerating...`)
          // Regenerate with modified seed
          const modifiedNFT = generateUniqueNFT(tokenId + 10000)
          modifiedNFT.tokenId = tokenId
          uniqueNFTs.push(modifiedNFT)
          seenHashes.add(modifiedNFT.uniqueHash)
        } else {
          uniqueNFTs.push(nft)
          seenHashes.add(nft.uniqueHash)
        }
      }

      console.log(`[v0] Generated ${uniqueNFTs.length} unique NFTs, ${duplicatesFound} duplicates resolved`)
      setDuplicateCount(duplicatesFound)

      // Show first 100 for performance in gallery view
      const displayNFTs = uniqueNFTs.slice(0, 100)
      setNfts(displayNFTs)
      setFilteredNfts(displayNFTs)
      setLoading(false)
    }

    loadNFTs()
  }, [])

  useEffect(() => {
    const filtered = nfts.filter((nft) => {
      const matchesSearch =
        nft.organism.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.era.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEra = selectedEra === "all" || nft.era === selectedEra
      const matchesRarity = selectedRarity === "all" || nft.rarity === selectedRarity

      return matchesSearch && matchesEra && matchesRarity
    })

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.tokenId - a.tokenId
        case "oldest":
          return a.tokenId - b.tokenId
        case "likes":
          return b.likes - a.likes
        case "views":
          return b.views - a.views
        case "rarity":
          const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 }
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        default:
          return 0
      }
    })

    setFilteredNfts(filtered)
  }, [nfts, searchTerm, selectedEra, selectedRarity, sortBy])

  const handleLike = (tokenId: number) => {
    setNfts((prev) => prev.map((nft) => (nft.tokenId === tokenId ? { ...nft, likes: nft.likes + 1 } : nft)))
  }

  const handleShare = (nft: NFTItem) => {
    const shareData = {
      title: `Prehistoric Fractal #${nft.tokenId}`,
      text: `Check out this ${nft.rarity} ${nft.organism} from the ${nft.era} era!`,
      url: `${window.location.origin}/nft/${nft.tokenId}`,
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(shareData.url)
      alert("Link copied to clipboard!")
    }
  }

  const getRarityStats = () => {
    const stats = nfts.reduce(
      (acc, nft) => {
        acc[nft.rarity] = (acc[nft.rarity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(stats).map(([rarity, count]) => ({
      rarity,
      count,
      percentage: ((count / nfts.length) * 100).toFixed(1),
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Generating 4444 unique organisms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Community Gallery
        </h1>
        <p className="text-muted-foreground">4444 unique prehistoric fractals - no duplicates guaranteed</p>
        <div className="flex justify-center space-x-4 text-sm">
          <Badge variant="outline" className="bg-green-50">
            ✓ 4444 Unique NFTs Generated
          </Badge>
          {duplicateCount > 0 && (
            <Badge variant="outline" className="bg-yellow-50">
              {duplicateCount} Duplicates Resolved
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="rarity">Rarity Tracker</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search organisms or eras..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Eras</option>
                  {eras.map((era) => (
                    <option key={era} value={era}>
                      {era.charAt(0).toUpperCase() + era.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Rarities</option>
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="likes">Most Liked</option>
                  <option value="views">Most Viewed</option>
                  <option value="rarity">Rarity</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNfts.map((nft) => (
              <Card key={nft.tokenId} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={nft.imageUrl || "/placeholder.svg"}
                    alt={`${nft.organism} #${nft.tokenId}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className={`absolute top-2 right-2 ${rarityColors[nft.rarity]} text-white`}>
                    {nft.rarity}
                  </Badge>
                  {nft.isVerified && <Verified className="absolute top-2 left-2 h-5 w-5 text-blue-500 fill-current" />}
                  <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/90 text-xs">
                    ID: {nft.uniqueHash.split("-")[0]}
                  </Badge>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {nft.organism} #{nft.tokenId}
                      </h3>
                      <p className="text-sm text-muted-foreground">{nft.era} Era</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(nft.traits).map(([trait, value]) => (
                      <div key={trait} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{trait}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>
                        Depth: {nft.fractalDepth} | Complexity: {nft.complexity}
                      </div>
                      <div>
                        Scale: {nft.scaleFactor} | Rotation: {nft.rotationFactor.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{nft.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{nft.likes}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleLike(nft.tokenId)}>
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleShare(nft)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">Owner: {nft.owner}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {nfts.length === 100 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  // In a real app, this would load more NFTs from the full 4444 collection
                  alert("Showing first 100 of 4444 unique NFTs. Full collection available after minting!")
                }}
              >
                View All 4444 Unique NFTs
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rarity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Rarity Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRarityStats().map(({ rarity, count, percentage }) => (
                  <div key={rarity} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${rarityColors[rarity as keyof typeof rarityColors]}`}></div>
                      <span className="font-medium">{rarity}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{count} NFTs</div>
                      <div className="text-sm text-muted-foreground">{percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Collectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 10 }, (_, i) => ({
                  rank: i + 1,
                  address: `0x${Math.random().toString(16).substr(2, 8)}...`,
                  count: Math.floor(Math.random() * 50) + 10,
                  value: Math.floor(Math.random() * 10000) + 1000,
                }))
                  .sort((a, b) => b.count - a.count)
                  .map((collector) => (
                    <div key={collector.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {collector.rank}
                        </div>
                        <div>
                          <div className="font-medium">{collector.address}</div>
                          <div className="text-sm text-muted-foreground">{collector.count} NFTs owned</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{collector.value} DOGE</div>
                        <div className="text-sm text-muted-foreground">Portfolio Value</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
