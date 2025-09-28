import { generateUniqueOrganism, GEOLOGIC_ERAS } from "./geologic-eras"

export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  tokenId: number
  era: string
  rarity: string
}

export function generateNFTMetadata(tokenId: number): NFTMetadata {
  // Determine era based on token ID distribution
  const eraIndex = Math.floor((tokenId - 1) / (4444 / 7))
  const era = GEOLOGIC_ERAS[Math.min(eraIndex, GEOLOGIC_ERAS.length - 1)]

  const organism = generateUniqueOrganism(era.id, tokenId)

  return {
    name: `${organism.name} #${tokenId}`,
    description: `A unique ${organism.name} from the ${era.name} era (${era.period}). ${era.description}. This artistic fractal NFT features recursive ${organism.fractalPattern} patterns with ${organism.traits.join(", ")} characteristics.`,
    image: `https://your-domain.com/api/nft/${tokenId}/image`,
    external_url: `https://your-domain.com/nft/${tokenId}`,
    attributes: [
      { trait_type: "Era", value: era.name },
      { trait_type: "Period", value: era.yearsAgo },
      { trait_type: "Organism Type", value: organism.type },
      { trait_type: "Size", value: organism.size },
      { trait_type: "Fractal Pattern", value: organism.fractalPattern },
      { trait_type: "Rarity", value: organism.rarity },
      { trait_type: "Complexity", value: Math.round(organism.complexity * 100) },
      { trait_type: "Color Variant", value: organism.colorVariant },
      ...organism.traits.map((trait) => ({ trait_type: "Trait", value: trait })),
    ],
    tokenId,
    era: era.id,
    rarity: organism.rarity,
  }
}

export function generateCollectionMetadata() {
  return {
    name: "Prehistoric Fractals",
    description:
      "A collection of 4444 unique artistic fractal organisms spanning 7 geologic eras. Each NFT features recursive patterns that reveal smaller copies when zoomed, creating stunning avatar-ready art that celebrates the history of life on Earth.",
    image: "https://your-domain.com/collection-image.jpg",
    external_link: "https://your-domain.com",
    seller_fee_basis_points: 500, // 5% royalty
    fee_recipient: "0x...", // Your wallet address
    total_supply: 4444,
    mint_price_doge: 44,
    mint_date: "2024-10-01T00:00:00Z",
  }
}
