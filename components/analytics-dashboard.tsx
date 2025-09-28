"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  Calculator,
  Crown,
  Activity,
  DollarSign,
  Users,
  Zap,
  Target,
  BarChart3,
  PieChartIcon,
} from "lucide-react"

interface CollectionStats {
  totalMinted: number
  totalSupply: number
  floorPrice: number
  volumeTraded: number
  uniqueHolders: number
  averagePrice: number
}

interface RarityData {
  rarity: string
  count: number
  percentage: number
  floorPrice: number
  color: string
}

interface HolderData {
  rank: number
  address: string
  nftCount: number
  portfolioValue: number
  percentageOwned: number
}

interface MintingData {
  date: string
  minted: number
  cumulative: number
  price: number
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]

export default function AnalyticsDashboard() {
  const [collectionStats, setCollectionStats] = useState<CollectionStats>({
    totalMinted: 1247,
    totalSupply: 4444,
    floorPrice: 42,
    volumeTraded: 18750,
    uniqueHolders: 892,
    averagePrice: 47.3,
  })

  const [rarityData, setRarityData] = useState<RarityData[]>([
    { rarity: "Common", count: 2222, percentage: 50.0, floorPrice: 42, color: "#8884d8" },
    { rarity: "Uncommon", count: 1333, percentage: 30.0, floorPrice: 55, color: "#82ca9d" },
    { rarity: "Rare", count: 667, percentage: 15.0, floorPrice: 85, color: "#ffc658" },
    { rarity: "Epic", count: 178, percentage: 4.0, floorPrice: 150, color: "#ff7300" },
    { rarity: "Legendary", count: 44, percentage: 1.0, floorPrice: 500, color: "#8dd1e1" },
  ])

  const [holderData, setHolderData] = useState<HolderData[]>([
    { rank: 1, address: "DQA6...8K3M", nftCount: 47, portfolioValue: 2350, percentageOwned: 3.77 },
    { rank: 2, address: "DH3K...9L2P", nftCount: 32, portfolioValue: 1680, percentageOwned: 2.57 },
    { rank: 3, address: "DM8R...4N7Q", nftCount: 28, portfolioValue: 1456, percentageOwned: 2.25 },
    { rank: 4, address: "DP5T...6R9S", nftCount: 24, portfolioValue: 1248, percentageOwned: 1.92 },
    { rank: 5, address: "DL7W...3V8X", nftCount: 21, portfolioValue: 1092, percentageOwned: 1.68 },
  ])

  const [mintingData, setMintingData] = useState<MintingData[]>([
    { date: "Sep 25", minted: 156, cumulative: 156, price: 35 },
    { date: "Sep 26", minted: 203, cumulative: 359, price: 35 },
    { date: "Sep 27", minted: 187, cumulative: 546, price: 35 },
    { date: "Sep 28", minted: 234, cumulative: 780, price: 40 },
    { date: "Sep 29", minted: 198, cumulative: 978, price: 40 },
    { date: "Sep 30", minted: 269, cumulative: 1247, price: 44 },
  ])

  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [rarityCalculatorInput, setRarityCalculatorInput] = useState("")
  const [calculatedRarity, setCalculatedRarity] = useState<any>(null)

  const calculateRarity = () => {
    if (!rarityCalculatorInput) return

    // Mock rarity calculation based on traits
    const traits = rarityCalculatorInput
      .toLowerCase()
      .split(",")
      .map((t) => t.trim())
    let rarityScore = 0

    // Simulate trait rarity scoring
    traits.forEach((trait) => {
      if (trait.includes("legendary")) rarityScore += 50
      else if (trait.includes("epic")) rarityScore += 30
      else if (trait.includes("rare")) rarityScore += 20
      else if (trait.includes("uncommon")) rarityScore += 10
      else rarityScore += 5
    })

    let rarity = "Common"
    let estimatedValue = 42

    if (rarityScore >= 100) {
      rarity = "Legendary"
      estimatedValue = 500
    } else if (rarityScore >= 60) {
      rarity = "Epic"
      estimatedValue = 150
    } else if (rarityScore >= 35) {
      rarity = "Rare"
      estimatedValue = 85
    } else if (rarityScore >= 20) {
      rarity = "Uncommon"
      estimatedValue = 55
    }

    setCalculatedRarity({
      rarity,
      score: rarityScore,
      estimatedValue,
      traits: traits.length,
    })
  }

  const getMintingProgress = () => {
    return (collectionStats.totalMinted / collectionStats.totalSupply) * 100
  }

  const getEraDistribution = () => {
    return [
      { name: "Hadean", value: 634, percentage: 14.3 },
      { name: "Archean", value: 634, percentage: 14.3 },
      { name: "Proterozoic", value: 634, percentage: 14.3 },
      { name: "Paleozoic", value: 634, percentage: 14.3 },
      { name: "Mesozoic", value: 634, percentage: 14.3 },
      { name: "Cenozoic", value: 634, percentage: 14.3 },
      { name: "Anthropocene", value: 640, percentage: 14.4 },
    ]
  }

  const getVolumeData = () => {
    return [
      { date: "Sep 25", volume: 2340, transactions: 45 },
      { date: "Sep 26", volume: 3120, transactions: 62 },
      { date: "Sep 27", volume: 2890, transactions: 58 },
      { date: "Sep 28", volume: 4560, transactions: 78 },
      { date: "Sep 29", volume: 3780, transactions: 69 },
      { date: "Sep 30", volume: 5260, transactions: 89 },
    ]
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Analytics Dashboard
        </h2>
        <p className="text-muted-foreground">Real-time collection insights, rarity analysis, and market data</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Minted</p>
                <p className="text-2xl font-bold">{collectionStats.totalMinted.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">of {collectionStats.totalSupply.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <Progress value={getMintingProgress()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Floor Price</p>
                <p className="text-2xl font-bold">{collectionStats.floorPrice} DOGE</p>
                <p className="text-xs text-green-600">+5.2% (24h)</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volume Traded</p>
                <p className="text-2xl font-bold">{collectionStats.volumeTraded.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">DOGE</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Holders</p>
                <p className="text-2xl font-bold">{collectionStats.uniqueHolders}</p>
                <p className="text-xs text-muted-foreground">
                  {((collectionStats.uniqueHolders / collectionStats.totalMinted) * 100).toFixed(1)}% ownership
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rarity">Rarity</TabsTrigger>
          <TabsTrigger value="holders">Holders</TabsTrigger>
          <TabsTrigger value="minting">Minting</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Era Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Era Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getEraDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getEraDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Trading Volume</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={getVolumeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="volume" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Mint", item: "Trilobite #1247", price: "44 DOGE", time: "2 min ago" },
                  { type: "Sale", item: "T-Rex #892", price: "156 DOGE", time: "5 min ago" },
                  { type: "Mint", item: "Mammoth #1246", price: "44 DOGE", time: "8 min ago" },
                  { type: "Sale", item: "Ammonite #634", price: "89 DOGE", time: "12 min ago" },
                  { type: "Mint", item: "Jellyfish #1245", price: "44 DOGE", time: "15 min ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={activity.type === "Mint" ? "default" : "secondary"}>{activity.type}</Badge>
                      <span className="font-medium">{activity.item}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{activity.price}</div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rarity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rarity Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Rarity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rarityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rarity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Rarity Table */}
            <Card>
              <CardHeader>
                <CardTitle>Rarity Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rarityData.map((rarity) => (
                    <div key={rarity.rarity} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded`} style={{ backgroundColor: rarity.color }}></div>
                        <div>
                          <div className="font-medium">{rarity.rarity}</div>
                          <div className="text-sm text-muted-foreground">{rarity.percentage}% of supply</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{rarity.count} NFTs</div>
                        <div className="text-sm text-muted-foreground">Floor: {rarity.floorPrice} DOGE</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="holders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Top Holders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holderData.map((holder) => (
                  <div key={holder.rank} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {holder.rank}
                      </div>
                      <div>
                        <div className="font-medium">{holder.address}</div>
                        <div className="text-sm text-muted-foreground">
                          {holder.percentageOwned.toFixed(2)}% of collection
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{holder.nftCount} NFTs</div>
                      <div className="text-sm text-muted-foreground">{holder.portfolioValue} DOGE value</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Minting Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Minting Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mintingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cumulative" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Minting */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Minting Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mintingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="minted" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Minting Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {mintingData[mintingData.length - 1]?.minted || 0}
                </div>
                <div className="text-sm text-muted-foreground">Minted Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {(mintingData.reduce((sum, day) => sum + day.minted, 0) / mintingData.length).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Daily Average</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.ceil((collectionStats.totalSupply - collectionStats.totalMinted) / 200)}
                </div>
                <div className="text-sm text-muted-foreground">Days to Sellout</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rarity Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Rarity Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Enter NFT Traits (comma-separated)</label>
                  <Input
                    placeholder="e.g., spiral pattern, oceanic colors, high complexity"
                    value={rarityCalculatorInput}
                    onChange={(e) => setRarityCalculatorInput(e.target.value)}
                  />
                </div>

                <Button onClick={calculateRarity} className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Rarity
                </Button>

                {calculatedRarity && (
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Predicted Rarity:</span>
                      <Badge
                        className={`${
                          calculatedRarity.rarity === "Legendary"
                            ? "bg-yellow-500"
                            : calculatedRarity.rarity === "Epic"
                              ? "bg-purple-500"
                              : calculatedRarity.rarity === "Rare"
                                ? "bg-blue-500"
                                : calculatedRarity.rarity === "Uncommon"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                        } text-white`}
                      >
                        {calculatedRarity.rarity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Rarity Score:</span>
                      <span>{calculatedRarity.score}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Estimated Value:</span>
                      <span className="font-semibold text-green-600">{calculatedRarity.estimatedValue} DOGE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Traits Count:</span>
                      <span>{calculatedRarity.traits}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Value Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Value Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Wallet Address</label>
                  <Input placeholder="Enter your DOGE wallet address..." />
                </div>

                <Button className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Track Portfolio
                </Button>

                {/* Mock Portfolio Data */}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">NFTs Owned:</span>
                    <span>7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Value:</span>
                    <span className="font-semibold text-green-600">423 DOGE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Average Value:</span>
                    <span>60.4 DOGE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">24h Change:</span>
                    <span className="text-green-600">+12.3 DOGE (+3.0%)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Your Collection:</h4>
                  <div className="space-y-2">
                    {[
                      { id: "#234", rarity: "Epic", value: "145 DOGE" },
                      { id: "#567", rarity: "Rare", value: "89 DOGE" },
                      { id: "#891", rarity: "Uncommon", value: "67 DOGE" },
                    ].map((nft, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>Fractal {nft.id}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{nft.rarity}</Badge>
                          <span className="font-medium">{nft.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
