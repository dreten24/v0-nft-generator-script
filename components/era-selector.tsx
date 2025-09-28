"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GEOLOGIC_ERAS, type GeologicEra } from "@/lib/geologic-eras"

interface EraSelectorProps {
  selectedEra: string | null
  onEraSelect: (era: GeologicEra) => void
  onGeneratePreview: () => void
  isGenerating: boolean
}

export function EraSelector({ selectedEra, onEraSelect, onGeneratePreview, isGenerating }: EraSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Geologic Era</h2>
        <p className="text-muted-foreground">Select from 7 major eras spanning 4.6 billion years of life on Earth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GEOLOGIC_ERAS.map((era) => (
          <Card
            key={era.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedEra === era.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onEraSelect(era)}
          >
            <div className="space-y-3">
              {/* Era colors preview */}
              <div className="flex gap-1 h-3 rounded overflow-hidden">
                {era.colors.map((color, index) => (
                  <div key={index} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{era.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {era.organisms.length} types
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground font-mono">{era.yearsAgo}</p>

                <p className="text-sm text-muted-foreground line-clamp-2">{era.description}</p>

                <div className="flex flex-wrap gap-1">
                  {era.characteristics.slice(0, 2).map((char, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  <strong>Organisms:</strong> {era.organisms.map((org) => org.name).join(", ")}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedEra && (
        <div className="text-center">
          <Button onClick={onGeneratePreview} disabled={isGenerating} size="lg" className="px-8">
            {isGenerating ? "Generating Preview..." : "Generate Preview"}
          </Button>
        </div>
      )}
    </div>
  )
}
