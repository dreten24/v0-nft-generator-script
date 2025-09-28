import { type NextRequest, NextResponse } from "next/server"
import { dogeMintingService } from "@/lib/doge-minting"

// In a real implementation, you'd use a proper database and payment processor
const pendingTransactions = new Map()

export async function POST(request: NextRequest) {
  try {
    const { organism, recipientAddress, priceInDoge } = await request.json()

    // Validate inputs
    if (!organism || !recipientAddress || !priceInDoge) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!dogeMintingService.isValidDogeAddress(recipientAddress)) {
      return NextResponse.json({ error: "Invalid Dogecoin address" }, { status: 400 })
    }

    // Generate unique transaction ID
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Generate payment address (in real implementation, use HD wallet)
    const paymentAddress = `D${Math.random().toString(36).substr(2, 33)}` // Mock address

    // Generate QR code
    const qrCode = dogeMintingService.generateQRCode(paymentAddress, priceInDoge)

    // Store pending transaction
    pendingTransactions.set(transactionId, {
      organism,
      recipientAddress,
      priceInDoge,
      paymentAddress,
      status: "pending",
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      paymentAddress,
      amount: priceInDoge,
      qrCode,
      transactionId,
    })
  } catch (error) {
    console.error("Error initiating mint:", error)
    return NextResponse.json({ error: "Failed to initiate mint" }, { status: 500 })
  }
}
