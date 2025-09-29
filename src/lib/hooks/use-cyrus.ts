import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface CyrusStatus {
  isRunning: boolean
  lastActivity: string
  activeIssues: number
  processedIssues: number
  errorCount: number
  repositories: Array<{
    id: string
    name: string
    isActive: boolean
    lastProcessed: string
  }>
}

interface CyrusConfig {
  id: string
  name: string
  repositoryPath: string
  baseBranch: string
  linearWorkspaceId: string
  isActive: boolean
  allowedTools: string[]
  teamKeys: string[]
  projectKeys: string[]
  routingLabels: string[]
}

// Fetch Cyrus status
export function useCyrusStatus() {
  return useQuery<CyrusStatus>({
    queryKey: ['cyrus', 'status'],
    queryFn: async () => {
      const response = await axios.get('/api/cyrus/status')
      return response.data
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  })
}

// Toggle Cyrus agent
export function useToggleCyrus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/cyrus/status', {
        action: 'toggle'
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cyrus', 'status'] })
    },
  })
}

// Toggle repository
export function useToggleRepository() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (configId: string) => {
      const response = await axios.post('/api/cyrus/status', {
        action: 'toggle_repository',
        configId
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cyrus', 'status'] })
    },
  })
}

// Update Cyrus configuration
export function useUpdateCyrusConfig() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (config: Partial<CyrusConfig>) => {
      const response = await axios.post('/api/cyrus/status', {
        action: 'update_config',
        config
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cyrus', 'status'] })
    },
  })
}

// Fetch Cyrus configuration
export function useCyrusConfig() {
  return useQuery<CyrusConfig[]>({
    queryKey: ['cyrus', 'config'],
    queryFn: async () => {
      // Mock configuration data
      return [
        {
          id: "repo1",
          name: "Main Repository",
          repositoryPath: "/Users/laptop/dev/v0-vercel-ai-app",
          baseBranch: "main",
          linearWorkspaceId: "workspace-123",
          isActive: true,
          allowedTools: ["Read(**)", "Edit(**)", "Bash(git:*)", "Task"],
          teamKeys: ["BACKEND", "FRONTEND"],
          projectKeys: ["API Service", "Web Platform"],
          routingLabels: ["backend", "frontend", "api"]
        }
      ]
    },
  })
}
