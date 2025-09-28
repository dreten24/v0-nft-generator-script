"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Check, AlertCircle } from "lucide-react"

interface AirdropWidgetProps {
  className?: string
}

export function AirdropWidget({ className }: AirdropWidgetProps) {
  const [walletAddress, setWalletAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  // DOGE wallet address validation
  const validateDogeAddress = (address: string): boolean => {
    // DOGE addresses start with 'D' and are 34 characters long (Base58)
    const dogeRegex = /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/
    return dogeRegex.test(address)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!walletAddress.trim()) {
      setError("Please enter your DOGE wallet address")
      return
    }

    if (!validateDogeAddress(walletAddress)) {
      setError("Please enter a valid DOGE wallet address (starts with 'D')")
      return
    }

    setIsSubmitting(true)

    try {
      // Store the signup (in a real app, this would be an API call)
      const existingSignups = JSON.parse(localStorage.getItem("airdropSignups") || "[]")

      // Check if already signed up
      if (existingSignups.includes(walletAddress)) {
        setError("This wallet address is already registered for the airdrop")
        setIsSubmitting(false)
        return
      }

      // Add to signups
      existingSignups.push(walletAddress)
      localStorage.setItem("airdropSignups", JSON.stringify(existingSignups))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      setWalletAddress("")
    } catch (err) {
      setError("Failed to register for airdrop. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className={`p-4 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-800 dark:text-green-200">Successfully Registered!</h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              You're now registered for the Prehistoric Fractals airdrop. Check back on October 1st!
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Gift className="w-3 h-3 mr-1" />
            Registered
          </Badge>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Gift className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary">Free Airdrop Signup</h3>
            <p className="text-sm text-muted-foreground">
              Enter your DOGE wallet address to receive free NFTs on launch day
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Limited Time
          </Badge>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter your DOGE wallet address (starts with 'D')"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className={error ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {error && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="w-3 h-3" />
                {error}
              </div>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting || !walletAddress.trim()} className="px-6">
            {isSubmitting ? "Registering..." : "Sign Up"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          * Airdrop recipients will receive 1-3 random NFTs from the collection on October 1st
        </div>
      </form>
    </Card>
  )
}
