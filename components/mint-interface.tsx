"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { dogeMintingService, MINT_CONFIG } from "@/lib/doge-minting"
import { Clock, CheckCircle, AlertCircle, Copy } from "lucide-react"

interface MintInterfaceProps {
  organism: any
  onMintComplete: (tokenId: number) => void
}

export function MintInterface({ organism, onMintComplete }: MintInterfaceProps) {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [mintStatus, setMintStatus] = useState<any>(null)
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "confirmed" | "failed">("idle")
  const [countdown, setCountdown] = useState<string>("")

  // Check mint status on component mount
  useEffect(() => {
    checkMintStatus()
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Poll payment status when payment is initiated
  useEffect(() => {
    if (paymentInfo && paymentStatus === "pending") {
      const pollInterval = setInterval(async () => {
        try {
          const status = await dogeMintingService.checkPaymentStatus(paymentInfo.transactionId)
          setPaymentStatus(status.status)

          if (status.status === "confirmed" && status.tokenId) {
            onMintComplete(status.tokenId)
            clearInterval(pollInterval)
          } else if (status.status === "failed") {
            setError("Payment failed. Please try again.")
            clearInterval(pollInterval)
          }
        } catch (error) {
          console.error("Error polling payment status:", error)
        }
      }, 5000) // Poll every 5 seconds

      return () => clearInterval(pollInterval)
    }
  }, [paymentInfo, paymentStatus])

  const checkMintStatus = async () => {
    try {
      const status = await dogeMintingService.checkMintStatus()
      setMintStatus(status)
    } catch (error) {
      console.error("Error checking mint status:", error)
    }
  }

  const updateCountdown = () => {
    const mintDate = new Date(MINT_CONFIG.mintStartDate)
    const now = new Date()
    const diff = mintDate.getTime() - now.getTime()

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    } else {
      setCountdown("")
    }
  }

  const handleMint = async () => {
    if (!recipientAddress) {
      setError("Please enter your Dogecoin address")
      return
    }

    if (!dogeMintingService.isValidDogeAddress(recipientAddress)) {
      setError("Please enter a valid Dogecoin address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const payment = await dogeMintingService.initiateMint(organism, recipientAddress)
      setPaymentInfo(payment)
      setPaymentStatus("pending")
    } catch (error) {
      setError("Failed to initiate mint. Please try again.")
      console.error("Mint error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const isMintActive = () => {
    const mintDate = new Date(MINT_CONFIG.mintStartDate)
    const now = new Date()
    return now >= mintDate && mintStatus?.remainingSupply > 0
  }

  if (paymentInfo && paymentStatus === "pending") {
    return (
      <Card className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-5 w-5 animate-spin" />
            <h3 className="text-xl font-bold">Payment Pending</h3>
          </div>

          <p className="text-muted-foreground">
            Send exactly <strong>{dogeMintingService.formatDogeAmount(paymentInfo.amount)}</strong> to the address below
          </p>

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Payment Address:</span>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(paymentInfo.paymentAddress)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <code className="block text-sm bg-background p-2 rounded border break-all">
              {paymentInfo.paymentAddress}
            </code>
          </div>

          <div className="flex justify-center">
            <img src={paymentInfo.qrCode || "/placeholder.svg"} alt="Payment QR Code" className="border rounded-lg" />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your NFT will be minted automatically once payment is confirmed. This usually takes 1-6 confirmations.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    )
  }

  if (paymentStatus === "confirmed") {
    return (
      <Card className="p-6 text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h3 className="text-xl font-bold text-green-600">Mint Successful!</h3>
        <p className="text-muted-foreground">Your Prehistoric Fractal NFT has been minted successfully.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Mint Your Prehistoric Fractal</h3>
        <p className="text-muted-foreground">
          {organism.name} from the {organism.era} era
        </p>
      </div>

      {/* Mint Status */}
      {mintStatus && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Minted:</span>
            <span className="text-sm">
              {mintStatus.totalMinted} / {MINT_CONFIG.maxSupply}
            </span>
          </div>
          <Progress value={(mintStatus.totalMinted / MINT_CONFIG.maxSupply) * 100} className="h-2" />

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{dogeMintingService.formatDogeAmount(MINT_CONFIG.priceInDoge)}</p>
              <p className="text-sm text-muted-foreground">Price</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{mintStatus.remainingSupply}</p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
        </div>
      )}

      {/* Countdown */}
      {countdown && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>Mint starts in:</strong> {countdown}
          </AlertDescription>
        </Alert>
      )}

      {/* Mint Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Dogecoin Address</label>
          <Input
            placeholder="D1234567890abcdef..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            The NFT will be sent to this address after payment confirmation
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleMint}
          disabled={!isMintActive() || isLoading || !recipientAddress}
          className="w-full"
          size="lg"
        >
          {isLoading
            ? "Initiating Mint..."
            : !isMintActive()
              ? countdown
                ? "Mint Not Started"
                : "Sold Out"
              : `Mint for ${dogeMintingService.formatDogeAmount(MINT_CONFIG.priceInDoge)}`}
        </Button>
      </div>

      {/* Mint Info */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
        <p>• Each NFT is unique with deterministic generation</p>
        <p>• Payment processed via Dogecoin blockchain</p>
        <p>• NFT minted automatically after 1-6 confirmations</p>
        <p>• October 1st, 2024 mint launch</p>
      </div>
    </Card>
  )
}
