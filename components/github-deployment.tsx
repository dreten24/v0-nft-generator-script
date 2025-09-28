"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Github, CheckCircle, AlertCircle, Loader2, Copy, Rocket, Code, Globe } from "lucide-react"
import { githubDeploymentService, type DeploymentConfig } from "@/lib/github-deployment"

interface GitHubDeploymentProps {
  onClose: () => void
}

export function GitHubDeployment({ onClose }: GitHubDeploymentProps) {
  const [config, setConfig] = useState<DeploymentConfig>({
    repoName: "prehistoric-fractals-nft",
    description: "4444 unique artistic fractal organisms across 7 geologic eras",
    includeReadme: true,
    includeVercelConfig: true,
    includePythonScripts: true,
    makePrivate: false,
  })

  const [deploymentState, setDeploymentState] = useState<"config" | "creating" | "deploying" | "complete" | "error">(
    "config",
  )

  const [progress, setProgress] = useState(0)
  const [repoUrl, setRepoUrl] = useState<string>("")
  const [deployUrl, setDeployUrl] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleDeploy = async () => {
    setDeploymentState("creating")
    setProgress(10)
    setError("")

    try {
      // Step 1: Create GitHub repository
      setProgress(25)
      const repoResult = await githubDeploymentService.createRepository(config)
      setRepoUrl(repoResult.repoUrl)

      setProgress(50)
      setDeploymentState("deploying")

      // Step 2: Deploy to Vercel
      setProgress(75)
      const deployResult = await githubDeploymentService.deployToVercel(repoResult.repoUrl)
      setDeployUrl(deployResult.deploymentUrl)

      setProgress(100)
      setDeploymentState("complete")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed")
      setDeploymentState("error")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const openUrl = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Github className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Deploy to GitHub</h2>
                <p className="text-sm text-muted-foreground">Create repository and deploy your NFT generator</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Configuration State */}
          {deploymentState === "config" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Repository Name</label>
                  <Input
                    value={config.repoName}
                    onChange={(e) => setConfig({ ...config, repoName: e.target.value })}
                    placeholder="prehistoric-fractals-nft"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={config.description}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    placeholder="4444 unique artistic fractal organisms..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Include Files</label>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="readme"
                      checked={config.includeReadme}
                      onCheckedChange={(checked) => setConfig({ ...config, includeReadme: checked as boolean })}
                    />
                    <label htmlFor="readme" className="text-sm">
                      README.md with setup instructions
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vercel"
                      checked={config.includeVercelConfig}
                      onCheckedChange={(checked) => setConfig({ ...config, includeVercelConfig: checked as boolean })}
                    />
                    <label htmlFor="vercel" className="text-sm">
                      Vercel deployment configuration
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="python"
                      checked={config.includePythonScripts}
                      onCheckedChange={(checked) => setConfig({ ...config, includePythonScripts: checked as boolean })}
                    />
                    <label htmlFor="python" className="text-sm">
                      Python fractal generation scripts
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="private"
                      checked={config.makePrivate}
                      onCheckedChange={(checked) => setConfig({ ...config, makePrivate: checked as boolean })}
                    />
                    <label htmlFor="private" className="text-sm">
                      Make repository private
                    </label>
                  </div>
                </div>
              </div>

              <Alert>
                <Code className="h-4 w-4" />
                <AlertDescription>
                  This will create a complete NFT generator with all 4444 organisms, minting functionality, and
                  deployment configuration.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button onClick={handleDeploy} className="flex-1">
                  <Rocket className="w-4 h-4 mr-2" />
                  Create & Deploy
                </Button>
                <Button variant="outline" onClick={onClose} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Creating/Deploying State */}
          {(deploymentState === "creating" || deploymentState === "deploying") && (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {deploymentState === "creating" ? "Creating Repository" : "Deploying to Vercel"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {deploymentState === "creating"
                      ? "Setting up your GitHub repository with all files..."
                      : "Deploying your NFT generator to production..."}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{progress}% complete</p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Files prepared</span>
                </div>
                {progress >= 25 && (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Repository created</span>
                  </div>
                )}
                {progress >= 50 && (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Code pushed to GitHub</span>
                  </div>
                )}
                {progress >= 75 && (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Vercel deployment started</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Complete State */}
          {deploymentState === "complete" && (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-bold text-green-600">Deployment Successful!</h3>
                  <p className="text-muted-foreground">Your Prehistoric Fractals NFT generator is now live</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">GitHub Repository:</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(repoUrl)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <code className="block text-sm bg-background p-2 rounded border break-all">{repoUrl}</code>
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Live Deployment:</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(deployUrl)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <code className="block text-sm bg-background p-2 rounded border break-all">{deployUrl}</code>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => openUrl(repoUrl)} variant="outline" className="flex-1 bg-transparent">
                  <Github className="w-4 h-4 mr-2" />
                  View Repository
                </Button>
                <Button onClick={() => openUrl(deployUrl)} className="flex-1">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Site
                </Button>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your NFT generator is ready! You can now customize it further, add environment variables, and start
                  minting.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Error State */}
          {deploymentState === "error" && (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-bold text-red-600">Deployment Failed</h3>
                  <p className="text-muted-foreground">There was an error during deployment</p>
                </div>
              </div>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  onClick={() => setDeploymentState("config")}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Try Again
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
