import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const { targetSizeKb } = await request.json()

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Simulate optimization progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 10
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Send final stats
          const finalStats = {
            stats: {
              totalGenerated: 4444,
              under8kb: Math.floor(4444 * 0.85), // 85% success rate estimate
              averageSizeKb: 6.8,
              successRate: 85,
              totalSizeMb: 29.2,
            },
          }

          controller.enqueue(encoder.encode(JSON.stringify(finalStats) + "\n"))
          controller.close()
        } else {
          const progressData = { progress: Math.floor(progress) }
          controller.enqueue(encoder.encode(JSON.stringify(progressData) + "\n"))
        }
      }, 200)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  })
}
