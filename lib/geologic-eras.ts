export interface GeologicEra {
  id: string
  name: string
  period: string
  yearsAgo: string
  description: string
  colors: string[]
  characteristics: string[]
  organisms: OrganismTemplate[]
}

export interface OrganismTemplate {
  id: string
  name: string
  type: "marine" | "terrestrial" | "aerial" | "microscopic"
  size: "tiny" | "small" | "medium" | "large" | "massive"
  complexity: number // 0.1 to 1.0
  fractalPattern: "spiral" | "branching" | "radial" | "bilateral" | "crystalline"
  rarity: "common" | "uncommon" | "rare" | "legendary"
  traits: string[]
}

export const GEOLOGIC_ERAS: GeologicEra[] = [
  {
    id: "precambrian",
    name: "Precambrian",
    period: "4.6 billion - 541 million years ago",
    yearsAgo: "4.6B - 541M",
    description: "The dawn of life - simple cells and early multicellular organisms",
    colors: ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#7209b7"],
    characteristics: ["Simple cellular structures", "Stromatolites", "First multicellular life"],
    organisms: [
      {
        id: "cyanobacteria",
        name: "Cyanobacteria",
        type: "microscopic",
        size: "tiny",
        complexity: 0.2,
        fractalPattern: "spiral",
        rarity: "common",
        traits: ["photosynthetic", "colonial"],
      },
      {
        id: "stromatolite",
        name: "Stromatolite",
        type: "marine",
        size: "medium",
        complexity: 0.3,
        fractalPattern: "crystalline",
        rarity: "uncommon",
        traits: ["layered", "ancient"],
      },
      {
        id: "acritarch",
        name: "Acritarch",
        type: "marine",
        size: "tiny",
        complexity: 0.4,
        fractalPattern: "radial",
        rarity: "rare",
        traits: ["spiny", "mysterious"],
      },
      {
        id: "dickinsonia",
        name: "Dickinsonia",
        type: "marine",
        size: "medium",
        complexity: 0.5,
        fractalPattern: "bilateral",
        rarity: "legendary",
        traits: ["quilted", "enigmatic"],
      },
    ],
  },
  {
    id: "paleozoic",
    name: "Paleozoic",
    period: "541 - 252 million years ago",
    yearsAgo: "541M - 252M",
    description: "Ancient life explosion - trilobites, early fish, and first land plants",
    colors: ["#2d5016", "#3e6b1f", "#4f7942", "#7ba05b", "#a8c686"],
    characteristics: ["Cambrian explosion", "First vertebrates", "Land colonization"],
    organisms: [
      {
        id: "trilobite",
        name: "Trilobite",
        type: "marine",
        size: "small",
        complexity: 0.7,
        fractalPattern: "bilateral",
        rarity: "common",
        traits: ["segmented", "compound eyes"],
      },
      {
        id: "brachiopod",
        name: "Brachiopod",
        type: "marine",
        size: "small",
        complexity: 0.6,
        fractalPattern: "bilateral",
        rarity: "common",
        traits: ["shelled", "filter feeder"],
      },
      {
        id: "crinoid",
        name: "Sea Lily",
        type: "marine",
        size: "medium",
        complexity: 0.8,
        fractalPattern: "radial",
        rarity: "uncommon",
        traits: ["stalked", "feathery arms"],
      },
      {
        id: "eurypterid",
        name: "Sea Scorpion",
        type: "marine",
        size: "large",
        complexity: 0.9,
        fractalPattern: "bilateral",
        rarity: "rare",
        traits: ["predatory", "armored"],
      },
      {
        id: "dunkleosteus",
        name: "Dunkleosteus",
        type: "marine",
        size: "massive",
        complexity: 0.9,
        fractalPattern: "bilateral",
        rarity: "legendary",
        traits: ["armored fish", "apex predator"],
      },
    ],
  },
  {
    id: "mesozoic",
    name: "Mesozoic",
    period: "252 - 66 million years ago",
    yearsAgo: "252M - 66M",
    description: "Age of reptiles - dinosaurs, marine reptiles, and early mammals",
    colors: ["#8b4513", "#a0522d", "#cd853f", "#daa520", "#ffd700"],
    characteristics: ["Dinosaur dominance", "First birds", "Flowering plants"],
    organisms: [
      {
        id: "triceratops",
        name: "Triceratops",
        type: "terrestrial",
        size: "massive",
        complexity: 0.9,
        fractalPattern: "bilateral",
        rarity: "uncommon",
        traits: ["three horns", "herbivore"],
      },
      {
        id: "tyrannosaurus",
        name: "T-Rex",
        type: "terrestrial",
        size: "massive",
        complexity: 0.95,
        fractalPattern: "bilateral",
        rarity: "legendary",
        traits: ["apex predator", "massive teeth"],
      },
      {
        id: "pteranodon",
        name: "Pteranodon",
        type: "aerial",
        size: "large",
        complexity: 0.8,
        fractalPattern: "bilateral",
        rarity: "rare",
        traits: ["flying reptile", "toothless"],
      },
      {
        id: "ammonite",
        name: "Ammonite",
        type: "marine",
        size: "medium",
        complexity: 0.7,
        fractalPattern: "spiral",
        rarity: "common",
        traits: ["spiral shell", "tentacles"],
      },
      {
        id: "plesiosaur",
        name: "Plesiosaur",
        type: "marine",
        size: "large",
        complexity: 0.8,
        fractalPattern: "bilateral",
        rarity: "uncommon",
        traits: ["long neck", "marine reptile"],
      },
    ],
  },
  {
    id: "cenozoic",
    name: "Cenozoic",
    period: "66 million years ago - present",
    yearsAgo: "66M - 0",
    description: "Age of mammals - rise of mammals, birds, and flowering plants",
    colors: ["#228b22", "#32cd32", "#90ee90", "#98fb98", "#f0fff0"],
    characteristics: ["Mammal radiation", "Grass evolution", "Ice ages"],
    organisms: [
      {
        id: "mammoth",
        name: "Woolly Mammoth",
        type: "terrestrial",
        size: "massive",
        complexity: 0.9,
        fractalPattern: "bilateral",
        rarity: "rare",
        traits: ["tusks", "fur covered"],
      },
      {
        id: "sabertooth",
        name: "Saber-tooth Cat",
        type: "terrestrial",
        size: "large",
        complexity: 0.85,
        fractalPattern: "bilateral",
        rarity: "uncommon",
        traits: ["long canines", "predator"],
      },
      {
        id: "giant-sloth",
        name: "Giant Ground Sloth",
        type: "terrestrial",
        size: "large",
        complexity: 0.8,
        fractalPattern: "bilateral",
        rarity: "uncommon",
        traits: ["massive claws", "herbivore"],
      },
      {
        id: "terror-bird",
        name: "Terror Bird",
        type: "terrestrial",
        size: "large",
        complexity: 0.8,
        fractalPattern: "bilateral",
        rarity: "rare",
        traits: ["flightless", "predatory beak"],
      },
      {
        id: "basilosaurus",
        name: "Basilosaurus",
        type: "marine",
        size: "massive",
        complexity: 0.9,
        fractalPattern: "bilateral",
        rarity: "legendary",
        traits: ["early whale", "serpentine"],
      },
    ],
  },
  {
    id: "devonian",
    name: "Devonian",
    period: "419 - 359 million years ago",
    yearsAgo: "419M - 359M",
    description: "Age of fishes - diverse marine life and first forests",
    colors: ["#4682b4", "#5f9ea0", "#87ceeb", "#b0e0e6", "#e0ffff"],
    characteristics: ["Fish diversity", "First forests", "Reef ecosystems"],
    organisms: [
      {
        id: "placoderm",
        name: "Placoderm",
        type: "marine",
        size: "medium",
        complexity: 0.7,
        fractalPattern: "bilateral",
        rarity: "common",
        traits: ["armored fish", "jawed"],
      },
      {
        id: "coelacanth",
        name: "Coelacanth",
        type: "marine",
        size: "medium",
        complexity: 0.8,
        fractalPattern: "bilateral",
        rarity: "rare",
        traits: ["lobe-finned", "living fossil"],
      },
      {
        id: "archaeopteris",
        name: "Archaeopteris",
        type: "terrestrial",
        size: "large",
        complexity: 0.6,
        fractalPattern: "branching",
        rarity: "uncommon",
        traits: ["early tree", "fern-like"],
      },
      {
        id: "bothrilepis",
        name: "Bothrilepis",
        type: "marine",
        size: "small",
        complexity: 0.6,
        fractalPattern: "bilateral",
        rarity: "common",
        traits: ["bottom dweller", "armored"],
      },
    ],
  },
  {
    id: "carboniferous",
    name: "Carboniferous",
    period: "359 - 299 million years ago",
    yearsAgo: "359M - 299M",
    description: "Coal forests and giant insects in oxygen-rich atmosphere",
    colors: ["#2f4f2f", "#556b2f", "#6b8e23", "#9acd32", "#adff2f"],
    characteristics: ["Coal swamps", "Giant arthropods", "High oxygen"],
    organisms: [
      {
        id: "meganeura",
        name: "Meganeura",
        type: "aerial",
        size: "large",
        complexity: 0.8,
        fractalPattern: "bilateral",
        rarity: "rare",
        traits: ["giant dragonfly", "predatory"],
      },
      {
        id: "arthropleura",
        name: "Arthropleura",
        type: "terrestrial",
        size: "massive",
        complexity: 0.7,
        fractalPattern: "bilateral",
        rarity: "legendary",
        traits: ["giant millipede", "herbivore"],
      },
      {
        id: "lepidodendron",
        name: "Scale Tree",
        type: "terrestrial",
        size: "massive",
        complexity: 0.5,
        fractalPattern: "branching",
        rarity: "common",
        traits: ["coal former", "scale bark"],
      },
      {
        id: "helicoprion",
        name: "Helicoprion",
        type: "marine",
        size: "large",
        complexity: 0.9,
        fractalPattern: "spiral",
        rarity: "legendary",
        traits: ["buzz-saw jaw", "mysterious"],
      },
    ],
  },
  {
    id: "permian",
    name: "Permian",
    period: "299 - 252 million years ago",
    yearsAgo: "299M - 252M",
    description: "The great dying - mass extinction and early reptile evolution",
    colors: ["#8b0000", "#a52a2a", "#dc143c", "#ff6347", "#ffa500"],
    characteristics: ["Supercontinent Pangaea", "Mass extinction", "Reptile evolution"],
    organisms: [
      {
        id: "dimetrodon",
        name: "Dimetrodon",
        type: "terrestrial",
        size: "large",
        complexity: 0.8,
        fractalPattern: "bilateral",
        rarity: "uncommon",
        traits: ["sail back", "synapsid"],
      },
      {
        id: "gorgonopsid",
        name: "Gorgonopsid",
        type: "terrestrial",
        size: "medium",
        complexity: 0.8,
        fractalPattern: "bilateral",
        rarity: "rare",
        traits: ["saber teeth", "therapsid"],
      },
      {
        id: "scutosaurus",
        name: "Scutosaurus",
        type: "terrestrial",
        size: "large",
        complexity: 0.7,
        fractalPattern: "bilateral",
        rarity: "uncommon",
        traits: ["armored", "herbivore"],
      },
      {
        id: "helicoprion",
        name: "Helicoprion",
        type: "marine",
        size: "large",
        complexity: 0.9,
        fractalPattern: "spiral",
        rarity: "legendary",
        traits: ["buzz-saw jaw", "shark relative"],
      },
    ],
  },
]

export function generateUniqueOrganism(
  eraId: string,
  tokenId: number,
): OrganismTemplate & {
  uniqueId: string
  tokenId: number
  era: string
  fractalSeed: number
  colorVariant: number
} {
  const era = GEOLOGIC_ERAS.find((e) => e.id === eraId)
  if (!era) throw new Error(`Era ${eraId} not found`)

  // Use tokenId as seed for deterministic generation
  const seed = tokenId
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Select base organism from era
  const baseOrganism = era.organisms[seed % era.organisms.length]

  // Generate unique variations
  const fractalSeed = Math.floor(random(seed * 2) * 1000000)
  const colorVariant = Math.floor(random(seed * 3) * era.colors.length)

  // Create trait variations
  const traitVariations = [
    "crystalline",
    "bioluminescent",
    "metallic",
    "translucent",
    "iridescent",
    "spined",
    "feathered",
    "scaled",
    "smooth",
    "textured",
    "compact",
    "elongated",
    "twisted",
    "symmetrical",
    "asymmetrical",
  ]

  const uniqueTraits = [
    ...baseOrganism.traits,
    traitVariations[Math.floor(random(seed * 4) * traitVariations.length)],
    traitVariations[Math.floor(random(seed * 5) * traitVariations.length)],
  ]

  return {
    ...baseOrganism,
    uniqueId: `${eraId}-${baseOrganism.id}-${tokenId}`,
    tokenId,
    era: eraId,
    fractalSeed,
    colorVariant,
    traits: uniqueTraits,
    complexity: Math.min(1.0, baseOrganism.complexity + random(seed * 6) * 0.2 - 0.1),
  }
}

export function getOrganismsByEra(eraId: string, count = 635): Array<ReturnType<typeof generateUniqueOrganism>> {
  const organisms: Array<ReturnType<typeof generateUniqueOrganism>> = []

  for (let i = 0; i < count; i++) {
    const tokenId = organisms.length + 1
    organisms.push(generateUniqueOrganism(eraId, tokenId))
  }

  return organisms
}

export function getAllOrganisms(): Array<ReturnType<typeof generateUniqueOrganism>> {
  const allOrganisms: Array<ReturnType<typeof generateUniqueOrganism>> = []
  const organismsPerEra = Math.floor(4444 / GEOLOGIC_ERAS.length)
  const remainder = 4444 % GEOLOGIC_ERAS.length

  GEOLOGIC_ERAS.forEach((era, index) => {
    const count = organismsPerEra + (index < remainder ? 1 : 0)
    const eraOrganisms = getOrganismsByEra(era.id, count)
    allOrganisms.push(...eraOrganisms)
  })

  return allOrganisms
}
