import { type NextRequest, NextResponse } from "next/server"

// Mock payment status checking - in real implementation, check Dogecoin blockchain
const pendingTransactions = new Map()

export async function GET(request: NextRequest, { params }: { params: { transactionId: string } }) {
  try {
    const { transactionId } = params

    const transaction = pendingTransactions.get(transactionId)
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Mock payment confirmation logic
    // In real implementation, check Dogecoin blockchain for payment
    const mockConfirmed = Math.random() > 0.7 // 30% chance of confirmation per check

    if (mockConfirmed && transaction.status === "pending") {
      // Generate token ID
      const tokenId = Math.floor(Math.random() * 4444) + 1

      // Update transaction status
      transaction.status = "confirmed"
      transaction.tokenId = tokenId
      transaction.txHash = `doge_tx_${Math.random().toString(36).substr(2, 16)}`
      transaction.confirmedAt = new Date().toISOString()

      pendingTransactions.set(transactionId, transaction)

      return NextResponse.json({
        status: "confirmed",
        confirmations: 6,
        txHash: transaction.txHash,
        tokenId: transaction.tokenId,
      })
    }

    return NextResponse.json({
      status: transaction.status,
      confirmations: transaction.status === "confirmed" ? 6 : 0,
    })
  } catch (error) {
    console.error("Error checking payment status:", error)
    return NextResponse.json({ error: "Failed to check payment status" }, { status: 500 })
  }
}
