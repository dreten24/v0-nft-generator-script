export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Natural Dogelection NFT Generator</h1>
        <p className="text-center text-lg mb-4">Generate unique fractal NFTs across 7 geological eras</p>
        <div className="text-center">
          <p className="mb-2">Run the Python script to generate your NFT collection:</p>
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            python scripts/batch-dogelection-generator.py
          </code>
        </div>
      </div>
    </main>
  )
}
