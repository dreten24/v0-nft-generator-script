"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sampleOrganisms = [
  {
    id: "butterfly-sample",
    name: "Butterfly Fractal",
    emoji: "🦋",
    description: "Recursive wing patterns",
    image: "/fractal-butterfly-with-recursive-wing-patterns.jpg",
  },
  {
    id: "jellyfish-sample",
    name: "Jellyfish Fractal",
    emoji: "🪼",
    description: "Tentacle recursion",
    image: "/fractal-jellyfish-with-recursive-tentacles.jpg",
  },
  {
    id: "coral-sample",
    name: "Coral Fractal",
    emoji: "🪸",
    description: "Branching structures",
    image: "/fractal-coral-with-recursive-branches.jpg",
  },
]

export function OrganismGallery() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Sample Fractals</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleOrganisms.map((organism) => (
          <Card key={organism.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
              <img
                src={organism.image || "/placeholder.svg"}
                alt={organism.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{organism.emoji}</span>
                <h4 className="font-medium text-sm">{organism.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground">{organism.description}</p>
              <Badge variant="outline" className="text-xs">
                Avatar Ready
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
