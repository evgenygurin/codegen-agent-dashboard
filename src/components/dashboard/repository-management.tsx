"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  useRepositories,
  useCreateRepository,
  useUpdateRepository,
  useDeleteRepository,
  useToggleAgent
} from "@/lib/hooks/use-codegen"
import { formatRelativeTime, getStatusColor } from "@/lib/utils"
import {
  GitBranch,
  Plus,
  Settings,
  Play,
  Pause,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Star,
  Eye,
  GitFork,
  AlertCircle
} from "lucide-react"
import type { Repository } from "@/lib/types/codegen"

interface RepositoryManagementProps {
  className?: string
}

export function RepositoryManagement({ className }: RepositoryManagementProps) {
  const { data: repositories, isLoading, error, refetch } = useRepositories()
  const createRepository = useCreateRepository()
  const updateRepository = useUpdateRepository()
  const deleteRepository = useDeleteRepository()
  const toggleAgent = useToggleAgent()

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
  const [showCreateForm, setShowCreateForm] = useState(false)

  const filteredRepositories = repositories?.data?.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && !repo.archived && !repo.disabled) ||
                         (filterStatus === "inactive" && (repo.archived || repo.disabled))
    
    return matchesSearch && matchesFilter
  }) || []

  const handleCreateRepository = async (repositoryData: Partial<Repository>) => {
    try {
      await createRepository.mutateAsync(repositoryData)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create repository:', error)
    }
  }

  const handleToggleAgent = async (repositoryId: string, enable: boolean) => {
    try {
      await toggleAgent.mutateAsync({ repositoryId, enable })
    } catch (error) {
      console.error('Failed to toggle agent:', error)
    }
  }

  const handleDeleteRepository = async (repositoryId: string) => {
    if (confirm('Are you sure you want to delete this repository? This action cannot be undone.')) {
      try {
        await deleteRepository.mutateAsync(repositoryId)
      } catch (error) {
        console.error('Failed to delete repository:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Repository Management
          </CardTitle>
          <CardDescription>Loading repositories...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Repository Error
          </CardTitle>
          <CardDescription>
            Failed to load repositories. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Repository Management
            </CardTitle>
            <CardDescription>
              Manage and monitor your connected repositories
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => refetch()}
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Repository
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
            >
              All ({repositories?.data?.length || 0})
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "active" ? "default" : "outline"}
              onClick={() => setFilterStatus("active")}
            >
              Active ({repositories?.data?.filter(r => !r.archived && !r.disabled).length || 0})
            </Button>
            <Button
              size="sm"
              variant={filterStatus === "inactive" ? "default" : "outline"}
              onClick={() => setFilterStatus("inactive")}
            >
              Inactive ({repositories?.data?.filter(r => r.archived || r.disabled).length || 0})
            </Button>
          </div>
        </div>

        {/* Repository List */}
        <div className="space-y-3">
          {filteredRepositories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No repositories found</p>
              <p className="text-sm">
                {searchQuery || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first repository to get started"
                }
              </p>
            </div>
          ) : (
            filteredRepositories.map((repository) => (
              <RepositoryCard
                key={repository.id}
                repository={repository}
                onToggleAgent={handleToggleAgent}
                onDelete={handleDeleteRepository}
              />
            ))
          )}
        </div>

        {/* Create Repository Form */}
        {showCreateForm && (
          <CreateRepositoryForm
            onSubmit={handleCreateRepository}
            onCancel={() => setShowCreateForm(false)}
            isLoading={createRepository.isPending}
          />
        )}
      </CardContent>
    </Card>
  )
}

interface RepositoryCardProps {
  repository: Repository
  onToggleAgent: (repositoryId: string, enable: boolean) => void
  onDelete: (repositoryId: string) => void
}

function RepositoryCard({ repository, onToggleAgent, onDelete }: RepositoryCardProps) {
  const [isAgentEnabled, setIsAgentEnabled] = useState(true) // This should come from agent config

  const handleToggleAgent = () => {
    const newState = !isAgentEnabled
    setIsAgentEnabled(newState)
    onToggleAgent(repository.id, newState)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium truncate">{repository.name}</h3>
                <Badge variant="outline" className={getStatusColor(repository.private ? 'private' : 'public')}>
                  {repository.private ? 'Private' : 'Public'}
                </Badge>
                {repository.archived && (
                  <Badge variant="secondary">Archived</Badge>
                )}
                {repository.disabled && (
                  <Badge variant="destructive">Disabled</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{repository.fullName}</p>
              {repository.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {repository.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {repository.stargazersCount}
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  {repository.forksCount}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {repository.watchersCount}
                </div>
                <span>Updated {formatRelativeTime(repository.updatedAt)}</span>
                {repository.language && (
                  <Badge variant="outline" className="text-xs">
                    {repository.language}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isAgentEnabled ? "default" : "outline"}
              onClick={handleToggleAgent}
            >
              {isAgentEnabled ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Disable Agent
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Enable Agent
                </>
              )}
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
            <Button size="sm" variant="outline">
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(repository.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CreateRepositoryFormProps {
  onSubmit: (data: Partial<Repository>) => void
  onCancel: () => void
  isLoading: boolean
}

function CreateRepositoryForm({ onSubmit, onCancel, isLoading }: CreateRepositoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    description: '',
    private: false,
    defaultBranch: 'main'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Repository</CardTitle>
        <CardDescription>
          Connect a new repository to the Codegen Agent Dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Repository Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="my-awesome-repo"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="username/my-awesome-repo"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A brief description of your repository"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Branch</label>
              <Input
                value={formData.defaultBranch}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultBranch: e.target.value }))}
                placeholder="main"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Visibility</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!formData.private ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, private: false }))}
                  className="flex-1"
                >
                  Public
                </Button>
                <Button
                  type="button"
                  variant={formData.private ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, private: true }))}
                  className="flex-1"
                >
                  Private
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Repository
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
