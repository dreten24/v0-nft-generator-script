"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Gift, Eye, EyeOff, TrendingUp, Clock, Star, ShoppingCart } from "lucide-react"

interface MintingPhase {
  name: string
  description: string
  price: number
  maxPerWallet: number
  totalSupply: number
  startTime: Date
  endTime: Date
  isActive: boolean
  requiresWhitelist: boolean
}

interface WhitelistEntry {
  address: string
  tier: "Genesis" | "Early" | "Standard"
  maxMints: number
  discountPercent: number
}

const mintingPhases: MintingPhase[] = [
  {
    name: "Genesis Whitelist",
    description: "Exclusive early access for Genesis supporters",
    price: 35, // 20% discount
    maxPerWallet: 10,
    totalSupply: 500,
    startTime: new Date("2024-09-25T00:00:00Z"),
    endTime: new Date("2024-09-28T23:59:59Z"),
    isActive: true,
    requiresWhitelist: true,
  },
  {
    name: "Early Access",
    description: "Early bird pricing for whitelisted users",
    price: 40, // 10% discount
    maxPerWallet: 5,
    totalSupply: 1000,
    startTime: new Date("2024-09-29T00:00:00Z"),
    endTime: new Date("2024-09-30T23:59:59Z"),
    isActive: false,
    requiresWhitelist: true,
  },
  {
    name: "Public Mint",
    description: "Public minting at full price",
    price: 44,
    maxPerWallet: 3,
    totalSupply: 2944,
    startTime: new Date("2024-10-01T00:00:00Z"),
    endTime: new Date("2024-12-31T23:59:59Z"),
    isActive: false,
    requiresWhitelist: false,
  },
]

const bulkDiscounts = [
  { quantity: 5, discount: 10, label: "5+ NFTs: 10% off" },
  { quantity: 10, discount: 15, label: "10+ NFTs: 15% off" },
  { quantity: 20, discount: 20, label: "20+ NFTs: 20% off" },
]

export default function MintingSuite() {
  const [walletAddress, setWalletAddress] = useState("")
  const [mintQuantity, setMintQuantity] = useState(1)
  const [whitelistStatus, setWhitelistStatus] = useState<WhitelistEntry | null>(null)
  const [dogePrice, setDogePrice] = useState(0.08) // USD price
  const [revealedTokens, setRevealedTokens] = useState<number[]>([])
  const [mysteryBoxes, setMysteryBoxes] = useState<number[]>([])
  const [currentPhase, setCurrentPhase] = useState(mintingPhases[0])
  const [totalMinted, setTotalMinted] = useState(127) // Mock current progress

  useEffect(() => {
    // Simulate real-time DOGE price updates
    const interval = setInterval(() => {
      setDogePrice((prev) => prev + (Math.random() - 0.5) * 0.002)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const checkWhitelistStatus = async () => {
    if (!walletAddress) return

    // Mock whitelist check
    const mockWhitelist: WhitelistEntry[] = [
      { address: "DQA6", tier: "Genesis", maxMints: 10, discountPercent: 20 },
      { address: "DH3K", tier: "Early", maxMints: 5, discountPercent: 10 },
      { address: "DM8R", tier: "Standard", maxMints: 3, discountPercent: 5 },
    ]

    const found = mockWhitelist.find((entry) => walletAddress.toUpperCase().includes(entry.address))

    setWhitelistStatus(found || null)
  }

  const calculatePrice = () => {
    let basePrice = currentPhase.price

    // Apply whitelist discount
    if (whitelistStatus) {
      basePrice = basePrice * (1 - whitelistStatus.discountPercent / 100)
    }

    // Apply bulk discount
    const bulkDiscount = bulkDiscounts.reverse().find((discount) => mintQuantity >= discount.quantity)

    if (bulkDiscount) {
      basePrice = basePrice * (1 - bulkDiscount.discount / 100)
    }

    return basePrice * mintQuantity
  }

  const calculateUSDPrice = () => {
    return (calculatePrice() * dogePrice).toFixed(2)
  }

  const handleMint = async () => {
    // Simulate minting process
    const newTokenIds = Array.from({ length: mintQuantity }, (_, i) => totalMinted + i + 1)

    // Add to mystery boxes (unrevealed)
    setMysteryBoxes((prev) => [...prev, ...newTokenIds])
    setTotalMinted((prev) => prev + mintQuantity)
  }

  const handleReveal = (tokenId: number) => {
    setMysteryBoxes((prev) => prev.filter((id) => id !== tokenId))
    setRevealedTokens((prev) => [...prev, tokenId])
  }

  const getPhaseProgress = () => {
    return (totalMinted / 4444) * 100
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "Genesis":
        return "bg-yellow-500"
      case "Early":
        return "bg-blue-500"
      case "Standard":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Enhanced Minting Suite
        </h2>
        <p className="text-muted-foreground">Whitelist access, bulk discounts, mystery reveals, and dynamic pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Minting Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="mint" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="mint">Mint</TabsTrigger>
              <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
              <TabsTrigger value="reveal">Reveal</TabsTrigger>
              <TabsTrigger value="phases">Phases</TabsTrigger>
            </TabsList>

            <TabsContent value="mint" className="space-y-6">
              {/* Current Phase Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{currentPhase.name}</span>
                    <Badge variant={currentPhase.isActive ? "default" : "secondary"}>
                      {currentPhase.isActive ? "Active" : "Upcoming"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{currentPhase.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <div className="font-semibold">{currentPhase.price} DOGE</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max/Wallet:</span>
                      <div className="font-semibold">{currentPhase.maxPerWallet}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Supply:</span>
                      <div className="font-semibold">{currentPhase.totalSupply}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Whitelist:</span>
                      <div className="font-semibold">{currentPhase.requiresWhitelist ? "Required" : "Open"}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Minting Progress</span>
                      <span>{totalMinted} / 4444</span>
                    </div>
                    <Progress value={getPhaseProgress()} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Minting Interface */}
              <Card>
                <CardHeader>
                  <CardTitle>Mint NFTs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Wallet Address</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter your DOGE wallet address..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                      />
                      <Button onClick={checkWhitelistStatus} variant="outline">
                        Check
                      </Button>
                    </div>
                  </div>

                  {whitelistStatus && (
                    <Alert>
                      <Star className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span>
                            Whitelist Status:
                            <Badge className={`ml-2 ${getTierBadgeColor(whitelistStatus.tier)} text-white`}>
                              {whitelistStatus.tier}
                            </Badge>
                          </span>
                          <span className="text-sm">
                            {whitelistStatus.discountPercent}% discount, max {whitelistStatus.maxMints} mints
                          </span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">Quantity</label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMintQuantity(Math.max(1, mintQuantity - 1))}
                        disabled={mintQuantity <= 1}
                      >
                        -
                      </Button>
                      <span className="font-semibold text-lg w-8 text-center">{mintQuantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMintQuantity(Math.min(currentPhase.maxPerWallet, mintQuantity + 1))}
                        disabled={mintQuantity >= currentPhase.maxPerWallet}
                      >
                        +
                      </Button>
                      <div className="flex gap-2 ml-4">
                        {[1, 3, 5, 10].map((qty) => (
                          <Button
                            key={qty}
                            variant="outline"
                            size="sm"
                            onClick={() => setMintQuantity(Math.min(currentPhase.maxPerWallet, qty))}
                            className={mintQuantity === qty ? "bg-primary text-primary-foreground" : ""}
                          >
                            {qty}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bulk Discount Info */}
                  {mintQuantity >= 5 && (
                    <Alert>
                      <Gift className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span>Bulk Discount Applied!</span>
                          <Badge variant="secondary">
                            {bulkDiscounts.reverse().find((d) => mintQuantity >= d.quantity)?.discount}% off
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Price Calculation */}
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price ({mintQuantity}x):</span>
                      <span>{(currentPhase.price * mintQuantity).toFixed(0)} DOGE</span>
                    </div>

                    {whitelistStatus && (
                      <div className="flex justify-between text-green-600">
                        <span>Whitelist Discount ({whitelistStatus.discountPercent}%):</span>
                        <span>
                          -{((currentPhase.price * mintQuantity * whitelistStatus.discountPercent) / 100).toFixed(0)}{" "}
                          DOGE
                        </span>
                      </div>
                    )}

                    {mintQuantity >= 5 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Bulk Discount:</span>
                        <span>-{(calculatePrice() * 0.1).toFixed(0)} DOGE</span>
                      </div>
                    )}

                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <div className="text-right">
                        <div>{calculatePrice().toFixed(0)} DOGE</div>
                        <div className="text-sm text-muted-foreground">${calculateUSDPrice()} USD</div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleMint}
                    className="w-full"
                    size="lg"
                    disabled={!walletAddress || (currentPhase.requiresWhitelist && !whitelistStatus)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Mint {mintQuantity} NFT{mintQuantity > 1 ? "s" : ""}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="whitelist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Whitelist Tiers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      tier: "Genesis",
                      discount: 20,
                      maxMints: 10,
                      requirement: "Early supporter or holder of 5+ NFTs",
                    },
                    { tier: "Early", discount: 10, maxMints: 5, requirement: "Community member or social engagement" },
                    {
                      tier: "Standard",
                      discount: 5,
                      maxMints: 3,
                      requirement: "Airdrop signup or newsletter subscriber",
                    },
                  ].map((tier) => (
                    <div key={tier.tier} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getTierBadgeColor(tier.tier)} text-white`}>{tier.tier}</Badge>
                          <span className="font-medium">{tier.discount}% Discount</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Max {tier.maxMints} mints</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.requirement}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reveal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Mystery Box Reveals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mysteryBoxes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <EyeOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No mystery boxes to reveal. Mint some NFTs first!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mysteryBoxes.map((tokenId) => (
                        <Card key={tokenId} className="text-center">
                          <CardContent className="p-4">
                            <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-3">
                              <div className="text-4xl">📦</div>
                            </div>
                            <h3 className="font-semibold mb-2">Mystery Box #{tokenId}</h3>
                            <Button size="sm" onClick={() => handleReveal(tokenId)}>
                              <Eye className="w-4 h-4 mr-1" />
                              Reveal
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {revealedTokens.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Recently Revealed</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {revealedTokens.slice(-6).map((tokenId) => (
                          <Card key={tokenId} className="text-center">
                            <CardContent className="p-4">
                              <img
                                src="/fractal-organism-with-recursive-patterns.jpg"
                                alt={`Prehistoric Fractal #${tokenId}`}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                              <h3 className="font-semibold">Fractal #{tokenId}</h3>
                              <Badge variant="outline" className="mt-1">
                                Revealed
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phases" className="space-y-6">
              <div className="space-y-4">
                {mintingPhases.map((phase, index) => (
                  <Card key={index} className={phase.isActive ? "ring-2 ring-primary" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{phase.name}</h3>
                          <p className="text-muted-foreground">{phase.description}</p>
                        </div>
                        <Badge variant={phase.isActive ? "default" : "secondary"}>
                          {phase.isActive ? "Active" : "Upcoming"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <div className="font-semibold">{phase.price} DOGE</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Supply:</span>
                          <div className="font-semibold">{phase.totalSupply}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max/Wallet:</span>
                          <div className="font-semibold">{phase.maxPerWallet}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Access:</span>
                          <div className="font-semibold">{phase.requiresWhitelist ? "Whitelist" : "Public"}</div>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {phase.startTime.toLocaleDateString()} - {phase.endTime.toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Live DOGE Price */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Live DOGE Price</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold">${dogePrice.toFixed(4)}</div>
                <div className="text-sm text-muted-foreground">USD per DOGE</div>
                <div className="mt-2 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +2.3% (24h)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Discounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span>Bulk Discounts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bulkDiscounts.map((discount, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-sm">{discount.quantity}+ NFTs</span>
                  <Badge variant="secondary">{discount.discount}% off</Badge>
                </div>
              ))}
              <div className="text-xs text-muted-foreground mt-2">* Discounts stack with whitelist benefits</div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Minted:</span>
                <span className="font-semibold">{totalMinted} / 4444</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Whitelist Spots:</span>
                <span className="font-semibold">1,500 / 2,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mystery Boxes:</span>
                <span className="font-semibold">{mysteryBoxes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revealed:</span>
                <span className="font-semibold">{revealedTokens.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
