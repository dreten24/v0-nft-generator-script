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
}

export default function CommunityGallery() {
  const [nfts, setNfts] = useState<NFTItem[]>([])
  const [filteredNfts, setFilteredNfts] = useState<NFTItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEra, setSelectedEra] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true)

  const rarityColors = {
    Common: "bg-gray-500",
    Uncommon: "bg-green-500",
    Rare: "bg-blue-500",
    Epic: "bg-purple-500",
    Legendary: "bg-yellow-500",
  }

  const eras = ["Hadean", "Archean", "Proterozoic", "Paleozoic", "Mesozoic", "Cenozoic", "Anthropocene"]

  useEffect(() => {
    // Simulate loading NFT data
    const loadNFTs = async () => {
      setLoading(true)
      // In real implementation, this would fetch from your API
      const mockNFTs: NFTItem[] = Array.from({ length: 50 }, (_, i) => ({
        tokenId: i + 1,
        owner: `0x${Math.random().toString(16).substr(2, 8)}...`,
        organism: ["Trilobite", "Ammonite", "T-Rex", "Mammoth", "Jellyfish"][Math.floor(Math.random() * 5)],
        era: eras[Math.floor(Math.random() * eras.length)],
        rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"][Math.floor(Math.random() * 5)] as any,
        traits: {
          "Fractal Pattern": ["Spiral", "Radial", "Bilateral", "Branching"][Math.floor(Math.random() * 4)],
          "Color Scheme": ["Oceanic", "Volcanic", "Forest", "Desert"][Math.floor(Math.random() * 4)],
          Complexity: ["Simple", "Moderate", "Complex", "Ultra"][Math.floor(Math.random() * 4)],
        },
        imageUrl: `/fractal-${["butterfly", "jellyfish", "coral"][Math.floor(Math.random() * 3)]}-with-recursive-${["wing-patterns", "tentacles", "branches"][Math.floor(Math.random() * 3)]}.jpg`,
        likes: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 1000),
        isVerified: Math.random() > 0.7,
      }))
      setNfts(mockNFTs)
      setFilteredNfts(mockNFTs)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Community Gallery
        </h1>
        <p className="text-muted-foreground">Discover and showcase the most beautiful prehistoric fractals</p>
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
                      {era}
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
