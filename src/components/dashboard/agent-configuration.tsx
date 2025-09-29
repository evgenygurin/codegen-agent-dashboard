"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useAgentConfig,
  useUpdateAgentConfig,
  useToggleAgent
} from "@/lib/hooks/use-codegen"
import { useRepositories } from "@/lib/hooks/use-codegen"
import {
  Brain,
  Settings,
  Save,
  RefreshCw,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  FileText,
  TestTube,
  Code
} from "lucide-react"
import type { AgentConfiguration } from "@/lib/types/codegen"

interface AgentConfigurationProps {
  repositoryId?: string
  className?: string
}

export function AgentConfiguration({ repositoryId, className }: AgentConfigurationProps) {
  const { data: repositories } = useRepositories()
  const { data: agentConfig, isLoading, error, refetch } = useAgentConfig(repositoryId || '')
  const updateAgentConfig = useUpdateAgentConfig()
  const toggleAgent = useToggleAgent()

  const [selectedRepositoryId, setSelectedRepositoryId] = useState(repositoryId || '')
  const [config, setConfig] = useState<Partial<AgentConfiguration>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (agentConfig) {
      setConfig(agentConfig)
    }
  }, [agentConfig])

  useEffect(() => {
    if (repositories?.data && repositories.data.length > 0 && !selectedRepositoryId) {
      setSelectedRepositoryId(repositories.data[0].id)
    }
  }, [repositories, selectedRepositoryId])

  const handleConfigChange = (key: keyof AgentConfiguration, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleSaveConfig = async () => {
    if (!selectedRepositoryId) return

    try {
      await updateAgentConfig.mutateAsync({
        repositoryId: selectedRepositoryId,
        config
      })
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save agent configuration:', error)
    }
  }

  const handleToggleAgent = async (enable: boolean) => {
    if (!selectedRepositoryId) return

    try {
      await toggleAgent.mutateAsync({ repositoryId: selectedRepositoryId, enable })
    } catch (error) {
      console.error('Failed to toggle agent:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agent Configuration
          </CardTitle>
          <CardDescription>Loading agent configuration...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
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
            <AlertTriangle className="h-5 w-5" />
            Configuration Error
          </CardTitle>
          <CardDescription>
            Failed to load agent configuration. Please try again.
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
              <Brain className="h-5 w-5" />
              Agent Configuration
            </CardTitle>
            <CardDescription>
              Configure autonomous development agents and workflows
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {selectedRepositoryId && (
              <AgentStatusIndicator repositoryId={selectedRepositoryId} />
            )}
            {hasChanges && (
              <Badge variant="warning">Unsaved Changes</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Repository Selection */}
        {repositories?.data && repositories.data.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Repository</label>
            <select
              value={selectedRepositoryId}
              onChange={(e) => setSelectedRepositoryId(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background"
            >
              {repositories.data.map((repo) => (
                <option key={repo.id} value={repo.id}>
                  {repo.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedRepositoryId && (
          <Tabs defaultValue="automation" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="automation">Automation</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
            </TabsList>

            <TabsContent value="automation" className="space-y-6">
              <AutomationSettings
                config={config}
                onChange={handleConfigChange}
              />
            </TabsContent>

            <TabsContent value="triggers" className="space-y-6">
              <TriggerSettings
                config={config}
                onChange={handleConfigChange}
              />
            </TabsContent>

            <TabsContent value="filters" className="space-y-6">
              <FilterSettings
                config={config}
                onChange={handleConfigChange}
              />
            </TabsContent>

            <TabsContent value="thresholds" className="space-y-6">
              <ThresholdSettings
                config={config}
                onChange={handleConfigChange}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Save Button */}
        {hasChanges && (
          <div className="flex justify-end">
            <Button onClick={handleSaveConfig} disabled={updateAgentConfig.isPending}>
              {updateAgentConfig.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface AutomationSettingsProps {
  config: Partial<AgentConfiguration>
  onChange: (key: keyof AgentConfiguration, value: any) => void
}

function AutomationSettings({ config, onChange }: AutomationSettingsProps) {
  const automationOptions = [
    {
      key: 'autoReview' as keyof AgentConfiguration,
      title: 'Auto Review',
      description: 'Automatically review pull requests when opened or updated',
      icon: <FileText className="h-4 w-4" />
    },
    {
      key: 'autoFix' as keyof AgentConfiguration,
      title: 'Auto Fix',
      description: 'Automatically fix issues detected in checks',
      icon: <Zap className="h-4 w-4" />
    },
    {
      key: 'autoOptimize' as keyof AgentConfiguration,
      title: 'Auto Optimize',
      description: 'Automatically optimize code for performance',
      icon: <Code className="h-4 w-4" />
    },
    {
      key: 'autoTest' as keyof AgentConfiguration,
      title: 'Auto Test',
      description: 'Automatically run and create tests for new code',
      icon: <TestTube className="h-4 w-4" />
    },
    {
      key: 'autoDocument' as keyof AgentConfiguration,
      title: 'Auto Document',
      description: 'Automatically generate and update documentation',
      icon: <FileText className="h-4 w-4" />
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Automation Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure which automated actions the agent should perform
          </p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {automationOptions.map((option) => (
          <Card key={option.key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    {option.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{option.title}</h4>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={config[option.key] as boolean || false}
                  onCheckedChange={(checked) => onChange(option.key, checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface TriggerSettingsProps {
  config: Partial<AgentConfiguration>
  onChange: (key: keyof AgentConfiguration, value: any) => void
}

function TriggerSettings({ config, onChange }: TriggerSettingsProps) {
  const reviewTriggers = [
    { value: 'pr_opened', label: 'PR Opened' },
    { value: 'pr_updated', label: 'PR Updated' },
    { value: 'push', label: 'Push to Branch' },
    { value: 'scheduled', label: 'Scheduled' }
  ]

  const fixTriggers = [
    { value: 'check_failed', label: 'Check Failed' },
    { value: 'review_requested', label: 'Review Requested' },
    { value: 'manual', label: 'Manual Trigger' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Trigger Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure when the agent should be triggered
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">Review Triggers</h4>
          <div className="grid grid-cols-2 gap-3">
            {reviewTriggers.map((trigger) => (
              <div key={trigger.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`review-${trigger.value}`}
                  checked={config.reviewTriggers?.includes(trigger.value as any) || false}
                  onChange={(e) => {
                    const current = config.reviewTriggers || []
                    const updated = e.target.checked
                      ? [...current, trigger.value]
                      : current.filter((t: string) => t !== trigger.value)
                    onChange('reviewTriggers', updated)
                  }}
                  className="rounded border-input"
                />
                <label htmlFor={`review-${trigger.value}`} className="text-sm">
                  {trigger.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Fix Triggers</h4>
          <div className="grid grid-cols-2 gap-3">
            {fixTriggers.map((trigger) => (
              <div key={trigger.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`fix-${trigger.value}`}
                  checked={config.fixTriggers?.includes(trigger.value as any) || false}
                  onChange={(e) => {
                    const current = config.fixTriggers || []
                    const updated = e.target.checked
                      ? [...current, trigger.value]
                      : current.filter((t: string) => t !== trigger.value)
                    onChange('fixTriggers', updated)
                  }}
                  className="rounded border-input"
                />
                <label htmlFor={`fix-${trigger.value}`} className="text-sm">
                  {trigger.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface FilterSettingsProps {
  config: Partial<AgentConfiguration>
  onChange: (key: keyof AgentConfiguration, value: any) => void
}

function FilterSettings({ config, onChange }: FilterSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Filter Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure which files and paths the agent should process
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Include Paths</label>
          <p className="text-xs text-muted-foreground mb-2">
            Only process files in these paths (one per line)
          </p>
          <textarea
            value={config.filters?.includePaths?.join('\n') || ''}
            onChange={(e) => onChange('filters', {
              ...config.filters,
              includePaths: e.target.value.split('\n').filter(path => path.trim())
            })}
            className="w-full p-3 border border-input rounded-md bg-background min-h-[100px]"
            placeholder="src/\nlib/\ncomponents/"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Exclude Paths</label>
          <p className="text-xs text-muted-foreground mb-2">
            Skip files in these paths (one per line)
          </p>
          <textarea
            value={config.filters?.excludePaths?.join('\n') || ''}
            onChange={(e) => onChange('filters', {
              ...config.filters,
              excludePaths: e.target.value.split('\n').filter(path => path.trim())
            })}
            className="w-full p-3 border border-input rounded-md bg-background min-h-[100px]"
            placeholder="node_modules/\n.git/\n*.test.js"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Include Extensions</label>
            <p className="text-xs text-muted-foreground mb-2">
              Only process files with these extensions
            </p>
            <Input
              value={config.filters?.includeExtensions?.join(', ') || ''}
              onChange={(e) => onChange('filters', {
                ...config.filters,
                includeExtensions: e.target.value.split(',').map(ext => ext.trim()).filter(ext => ext)
              })}
              placeholder="js, ts, tsx, jsx"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Exclude Extensions</label>
            <p className="text-xs text-muted-foreground mb-2">
              Skip files with these extensions
            </p>
            <Input
              value={config.filters?.excludeExtensions?.join(', ') || ''}
              onChange={(e) => onChange('filters', {
                ...config.filters,
                excludeExtensions: e.target.value.split(',').map(ext => ext.trim()).filter(ext => ext)
              })}
              placeholder="md, txt, log"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ThresholdSettingsProps {
  config: Partial<AgentConfiguration>
  onChange: (key: keyof AgentConfiguration, value: any) => void
}

function ThresholdSettings({ config, onChange }: ThresholdSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Threshold Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure limits and thresholds for agent actions
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Max Files Per Action</label>
          <p className="text-xs text-muted-foreground mb-2">
            Maximum number of files to process in a single action
          </p>
          <Input
            type="number"
            value={config.thresholds?.maxFilesPerAction || 50}
            onChange={(e) => onChange('thresholds', {
              ...config.thresholds,
              maxFilesPerAction: parseInt(e.target.value) || 50
            })}
            min="1"
            max="1000"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Max Changes Per File</label>
          <p className="text-xs text-muted-foreground mb-2">
            Maximum number of changes to make to a single file
          </p>
          <Input
            type="number"
            value={config.thresholds?.maxChangesPerFile || 100}
            onChange={(e) => onChange('thresholds', {
              ...config.thresholds,
              maxChangesPerFile: parseInt(e.target.value) || 100
            })}
            min="1"
            max="1000"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Complexity Threshold</label>
          <p className="text-xs text-muted-foreground mb-2">
            Maximum cyclomatic complexity before optimization
          </p>
          <Input
            type="number"
            value={config.thresholds?.complexityThreshold || 10}
            onChange={(e) => onChange('thresholds', {
              ...config.thresholds,
              complexityThreshold: parseInt(e.target.value) || 10
            })}
            min="1"
            max="50"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Performance Threshold</label>
          <p className="text-xs text-muted-foreground mb-2">
            Minimum performance score before optimization
          </p>
          <Input
            type="number"
            value={config.thresholds?.performanceThreshold || 80}
            onChange={(e) => onChange('thresholds', {
              ...config.thresholds,
              performanceThreshold: parseInt(e.target.value) || 80
            })}
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  )
}

interface AgentStatusIndicatorProps {
  repositoryId: string
}

function AgentStatusIndicator({ repositoryId }: AgentStatusIndicatorProps) {
  // This would typically come from the agent status API
  const [isEnabled, setIsEnabled] = useState(true)

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
      <span className="text-sm text-muted-foreground">
        Agent {isEnabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  )
}
