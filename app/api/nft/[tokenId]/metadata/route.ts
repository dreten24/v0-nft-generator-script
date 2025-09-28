import { type NextRequest, NextResponse } from "next/server"
import { generateNFTMetadata } from "@/lib/nft-metadata"

export async function GET(request: NextRequest, { params }: { params: { tokenId: string } }) {
  try {
    const tokenId = Number.parseInt(params.tokenId)

    if (isNaN(tokenId) || tokenId < 1 || tokenId > 4444) {
      return NextResponse.json({ error: "Invalid token ID" }, { status: 400 })
    }

    const metadata = generateNFTMetadata(tokenId)

    return NextResponse.json(metadata, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Error generating NFT metadata:", error)
    return NextResponse.json({ error: "Failed to generate metadata" }, { status: 500 })
  }
}
