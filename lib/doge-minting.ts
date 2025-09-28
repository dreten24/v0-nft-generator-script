"use client"

export interface MintConfig {
  priceInDoge: number
  maxSupply: number
  mintStartDate: string
  contractAddress: string
  networkId: string
}

export interface MintTransaction {
  tokenId: number
  txHash: string
  dogeAmount: number
  recipientAddress: string
  timestamp: string
  status: "pending" | "confirmed" | "failed"
}

export const MINT_CONFIG: MintConfig = {
  priceInDoge: 44,
  maxSupply: 4444,
  mintStartDate: "2024-10-01T00:00:00Z",
  contractAddress: "DPrehistoricFractalsNFTContractAddress", // Replace with actual contract
  networkId: "dogecoin-mainnet",
}

export class DogeMintingService {
  private apiEndpoint = "/api/mint"

  async checkMintStatus(): Promise<{
    isActive: boolean
    totalMinted: number
    remainingSupply: number
    currentPrice: number
  }> {
    try {
      const response = await fetch(`${this.apiEndpoint}/status`)
      if (!response.ok) throw new Error("Failed to fetch mint status")
      return await response.json()
    } catch (error) {
      console.error("Error checking mint status:", error)
      throw error
    }
  }

  async initiateMint(
    organism: any,
    recipientAddress: string,
  ): Promise<{
    paymentAddress: string
    amount: number
    qrCode: string
    transactionId: string
  }> {
    try {
      const response = await fetch(`${this.apiEndpoint}/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organism,
          recipientAddress,
          priceInDoge: MINT_CONFIG.priceInDoge,
        }),
      })

      if (!response.ok) throw new Error("Failed to initiate mint")
      return await response.json()
    } catch (error) {
      console.error("Error initiating mint:", error)
      throw error
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<{
    status: "pending" | "confirmed" | "failed"
    confirmations: number
    txHash?: string
    tokenId?: number
  }> {
    try {
      const response = await fetch(`${this.apiEndpoint}/payment-status/${transactionId}`)
      if (!response.ok) throw new Error("Failed to check payment status")
      return await response.json()
    } catch (error) {
      console.error("Error checking payment status:", error)
      throw error
    }
  }

  async getMintHistory(address: string): Promise<MintTransaction[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/history/${address}`)
      if (!response.ok) throw new Error("Failed to fetch mint history")
      return await response.json()
    } catch (error) {
      console.error("Error fetching mint history:", error)
      throw error
    }
  }

  generateQRCode(address: string, amount: number): string {
    // Generate Dogecoin payment QR code
    const dogeUri = `dogecoin:${address}?amount=${amount}&label=Prehistoric%20Fractals%20NFT`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dogeUri)}`
  }

  formatDogeAmount(amount: number): string {
    return `${amount.toLocaleString()} DOGE`
  }

  isValidDogeAddress(address: string): boolean {
    // Basic Dogecoin address validation
    return /^D[5-9A-HJ-NP-U][1-9A-HJ-NP-Za-km-z]{32}$/.test(address)
  }
}

export const dogeMintingService = new DogeMintingService()
