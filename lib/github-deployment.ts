"use client"

export interface GitHubRepo {
  name: string
  description: string
  private: boolean
  homepage?: string
}

export interface DeploymentConfig {
  repoName: string
  description: string
  includeReadme: boolean
  includeVercelConfig: boolean
  includePythonScripts: boolean
  makePrivate: boolean
}

export class GitHubDeploymentService {
  private apiEndpoint = "/api/github"

  async createRepository(config: DeploymentConfig): Promise<{
    repoUrl: string
    cloneUrl: string
    deployUrl?: string
  }> {
    try {
      const response = await fetch(`${this.apiEndpoint}/create-repo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create repository")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating repository:", error)
      throw error
    }
  }

  async deployToVercel(repoUrl: string): Promise<{
    deploymentUrl: string
    projectId: string
  }> {
    try {
      const response = await fetch(`${this.apiEndpoint}/deploy-vercel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to deploy to Vercel")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deploying to Vercel:", error)
      throw error
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<{
    status: "building" | "ready" | "error"
    url?: string
    logs?: string[]
  }> {
    try {
      const response = await fetch(`${this.apiEndpoint}/deployment-status/${deploymentId}`)

      if (!response.ok) {
        throw new Error("Failed to get deployment status")
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting deployment status:", error)
      throw error
    }
  }

  generateReadmeContent(config: DeploymentConfig): string {
    return `# Prehistoric Fractals NFT Generator

A collection of 4444 unique artistic fractal organisms spanning 7 geologic eras. Each NFT features recursive patterns that reveal smaller copies when zoomed, creating stunning avatar-ready art that celebrates the history of life on Earth.

## Features

- **4444 Unique Organisms**: Deterministically generated across 7 geologic eras
- **Artistic Fractals**: Not mathematical fractals, but artistic ones with recursive organism patterns
- **Avatar Ready**: High-resolution 1024×1024 output perfect for social media
- **DOGE Minting**: Mint for 44 DOGE each starting October 1st, 2024
- **Era Authentic**: Each era features period-appropriate organisms and color palettes

## Geologic Eras

1. **Precambrian** (4.6B - 541M years ago) - Dawn of life
2. **Paleozoic** (541M - 252M years ago) - Ancient life explosion
3. **Mesozoic** (252M - 66M years ago) - Age of reptiles
4. **Cenozoic** (66M - 0 years ago) - Age of mammals
5. **Devonian** (419M - 359M years ago) - Age of fishes
6. **Carboniferous** (359M - 299M years ago) - Coal forests
7. **Permian** (299M - 252M years ago) - The great dying

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.8+ (for fractal generation)
- Dogecoin wallet for minting

### Installation

\`\`\`bash
# Clone the repository
git clone ${config.repoName}
cd prehistoric-fractals

# Install dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Run development server
npm run dev
\`\`\`

### Environment Variables

Create a \`.env.local\` file:

\`\`\`env
# Dogecoin Configuration
DOGE_WALLET_ADDRESS=your_doge_address
DOGE_PRIVATE_KEY=your_private_key

# Database (optional)
DATABASE_URL=your_database_url

# Vercel (for deployment)
VERCEL_TOKEN=your_vercel_token
\`\`\`

## Usage

### Generate Fractals

1. Select a geologic era
2. Choose organism parameters
3. Generate preview
4. Mint for 44 DOGE

### Batch Generation

Generate all 4444 organisms:

\`\`\`bash
python scripts/generate-4444-organisms.py
\`\`\`

## Deployment

### Vercel (Recommended)

\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Manual Deployment

\`\`\`bash
npm run build
npm run start
\`\`\`

## API Endpoints

- \`GET /api/mint/status\` - Get mint status
- \`POST /api/mint/initiate\` - Start minting process
- \`GET /api/nft/[tokenId]/metadata\` - Get NFT metadata
- \`GET /api/nft/[tokenId]/image\` - Get NFT image

## Collection Details

- **Total Supply**: 4444 NFTs
- **Mint Price**: 44 DOGE each
- **Launch Date**: October 1st, 2024
- **Resolution**: 1024×1024 pixels
- **Format**: PNG with transparency
- **Blockchain**: Dogecoin

## Technical Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Fractal Generation**: Python with PIL
- **Payment**: Dogecoin blockchain
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, open an issue on GitHub or contact the development team.

---

Built with Steve Jobs-level precision for the NFT community.
`
  }

  generateVercelConfig(): string {
    return `{
  "version": 2,
  "name": "prehistoric-fractals",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    },
    {
      "src": "scripts/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/generate/(.*)",
      "dest": "/scripts/generate-fractal.py"
    }
  ],
  "env": {
    "DOGE_WALLET_ADDRESS": "@doge-wallet-address",
    "DATABASE_URL": "@database-url"
  },
  "functions": {
    "app/api/mint/*/route.ts": {
      "maxDuration": 30
    },
    "scripts/generate-4444-organisms.py": {
      "maxDuration": 300
    }
  }
}`
  }

  generatePackageJson(): string {
    return `{
  "name": "prehistoric-fractals",
  "version": "1.0.0",
  "description": "4444 unique artistic fractal organisms across 7 geologic eras",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "generate-all": "python scripts/generate-4444-organisms.py",
    "deploy": "vercel --prod"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-button": "^0.1.0",
    "@radix-ui/react-card": "^0.1.0",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-input": "^0.1.0",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-config-next": "14.0.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^4.0.0-alpha.4",
    "typescript": "^5.2.2"
  },
  "keywords": [
    "nft",
    "fractals",
    "dogecoin",
    "prehistoric",
    "organisms",
    "art",
    "avatars"
  ],
  "author": "Prehistoric Fractals Team",
  "license": "MIT",
  "homepage": "https://prehistoric-fractals.vercel.app",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/prehistoric-fractals.git"
  }
}`
  }

  generatePythonRequirements(): string {
    return `# Core dependencies for fractal generation
Pillow==10.1.0
numpy==1.24.3
colorsys-python==1.0.0

# Optional dependencies for enhanced features
matplotlib==3.7.2
scipy==1.11.3

# Web framework (if needed for API endpoints)
flask==2.3.3
requests==2.31.0

# Image processing enhancements
opencv-python==4.8.1.78
scikit-image==0.21.0

# Performance optimizations
numba==0.58.1
cython==3.0.5
`
  }
}

export const githubDeploymentService = new GitHubDeploymentService()
