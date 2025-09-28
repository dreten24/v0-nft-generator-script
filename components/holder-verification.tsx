"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Verified, Shield, Crown, Star } from "lucide-react"

interface VerificationTier {
  name: string
  icon: React.ReactNode
  requirement: string
  benefits: string[]
  color: string
}

const verificationTiers: VerificationTier[] = [
  {
    name: "Verified Holder",
    icon: <Verified className="h-4 w-4" />,
    requirement: "Own 1+ NFT",
    benefits: ["Verified badge", "Access to holder chat", "Early announcements"],
    color: "bg-blue-500",
  },
  {
    name: "Era Collector",
    icon: <Shield className="h-4 w-4" />,
    requirement: "Own NFTs from 3+ eras",
    benefits: ["Special Discord role", "Exclusive events", "Breeding priority"],
    color: "bg-purple-500",
  },
  {
    name: "Legendary Keeper",
    icon: <Crown className="h-4 w-4" />,
    requirement: "Own 1+ Legendary NFT",
    benefits: ["VIP status", "Direct dev access", "Future airdrops"],
    color: "bg-yellow-500",
  },
  {
    name: "Genesis Guardian",
    icon: <Star className="h-4 w-4" />,
    requirement: "Own 10+ NFTs",
    benefits: ["Maximum rewards", "Governance voting", "Exclusive merch"],
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
]

export default function HolderVerification() {
  const [walletAddress, setWalletAddress] = useState("")
  const [discordUsername, setDiscordUsername] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVerification = async () => {
    if (!walletAddress || !discordUsername) return

    setLoading(true)

    // Simulate verification process
    setTimeout(() => {
      // Mock verification logic
      const mockNFTCount = Math.floor(Math.random() * 20) + 1
      const hasLegendary = Math.random() > 0.8
      const eraCount = Math.floor(Math.random() * 7) + 1

      let tier = "Verified Holder"
      if (mockNFTCount >= 10) tier = "Genesis Guardian"
      else if (hasLegendary) tier = "Legendary Keeper"
      else if (eraCount >= 3) tier = "Era Collector"

      setVerificationStatus(tier)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Holder Verification</h2>
        <p className="text-muted-foreground">Verify your NFT holdings to unlock exclusive benefits and Discord roles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Form */}
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Holdings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Wallet Address</label>
              <Input
                placeholder="Enter your wallet address..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Discord Username</label>
              <Input
                placeholder="YourUsername#1234"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
              />
            </div>

            <Button
              onClick={handleVerification}
              disabled={!walletAddress || !discordUsername || loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify Holdings"}
            </Button>

            {verificationStatus && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center space-x-2">
                  <Verified className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Verification Successful!</span>
                </div>
                <p className="text-green-700 mt-1">
                  You've been verified as: <strong>{verificationStatus}</strong>
                </p>
                <p className="text-sm text-green-600 mt-2">Check your Discord for your new role!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Tiers */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Tiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationTiers.map((tier, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${tier.color} text-white`}>{tier.icon}</div>
                    <span className="font-medium">{tier.name}</span>
                  </div>
                  <Badge variant="outline">{tier.requirement}</Badge>
                </div>

                <div className="space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="text-sm text-muted-foreground flex items-center space-x-1">
                      <span>•</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
