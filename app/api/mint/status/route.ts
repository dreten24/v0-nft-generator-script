import { NextResponse } from "next/server"
import { MINT_CONFIG } from "@/lib/doge-minting"

// In a real implementation, this would connect to your database
const totalMinted = 0

export async function GET() {
  try {
    // Check if mint is active
    const mintDate = new Date(MINT_CONFIG.mintStartDate)
    const now = new Date()
    const isActive = now >= mintDate && totalMinted < MINT_CONFIG.maxSupply

    return NextResponse.json({
      isActive,
      totalMinted,
      remainingSupply: MINT_CONFIG.maxSupply - totalMinted,
      currentPrice: MINT_CONFIG.priceInDoge,
    })
  } catch (error) {
    console.error("Error fetching mint status:", error)
    return NextResponse.json({ error: "Failed to fetch mint status" }, { status: 500 })
  }
}
