"use client"

import { useState, useEffect } from "react"
import { useCyrusStatus, useToggleCyrus, useToggleRepository, useCyrusConfig } from "@/lib/hooks/use-cyrus"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  Play,
  Pause,
  Settings,
  GitBranch,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Brain,
  Terminal,
  Webhook
} from "lucide-react"

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

interface CyrusStatus {
  isRunning: boolean
  lastActivity: string
  activeIssues: number
  processedIssues: number
  errorCount: number
}

export function CyrusIntegration() {
  const { data: status, isLoading: statusLoading } = useCyrusStatus()
  const { data: configs, isLoading: configsLoading } = useCyrusConfig()
  const toggleCyrusMutation = useToggleCyrus()
  const toggleRepositoryMutation = useToggleRepository()

  const toggleCyrus = async () => {
    toggleCyrusMutation.mutate()
  }

  const toggleRepository = async (configId: string) => {
    toggleRepositoryMutation.mutate(configId)
  }

  if (statusLoading || configsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Cyrus configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-500" />
            Cyrus AI Agent Integration
          </h2>
          <p className="text-muted-foreground">
            Автономный агент разработки на основе Claude Code для Linear
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status?.isRunning ? "default" : "secondary"}>
            {status?.isRunning ? (
              <>
                <Activity className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Paused
              </>
            )}
          </Badge>
          <Button 
            onClick={toggleCyrus}
            disabled={toggleCyrusMutation.isPending}
            variant={status?.isRunning ? "destructive" : "default"}
          >
            {status?.isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Cyrus
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Cyrus
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Active Issues</p>
                <p className="text-2xl font-bold">{status?.activeIssues || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Processed</p>
                <p className="text-2xl font-bold">{status?.processedIssues || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Last Activity</p>
                <p className="text-sm font-bold">{status?.lastActivity ? new Date(status.lastActivity).toLocaleString() : 'Never'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Errors</p>
                <p className="text-2xl font-bold">{status?.errorCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="repositories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="repositories">
            <GitBranch className="h-4 w-4 mr-2" />
            Repositories
          </TabsTrigger>
          <TabsTrigger value="tools">
            <Zap className="h-4 w-4 mr-2" />
            Tools & Permissions
          </TabsTrigger>
          <TabsTrigger value="routing">
            <Settings className="h-4 w-4 mr-2" />
            Routing Rules
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Terminal className="h-4 w-4 mr-2" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repositories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repository Configuration</CardTitle>
              <CardDescription>
                Настройте репозитории для автоматической обработки Linear issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configs?.map((config) => (
                <div key={config.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{config.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {config.repositoryPath}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.isActive ? "default" : "secondary"}>
                        {config.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Switch
                        checked={config.isActive}
                        onCheckedChange={() => toggleRepository(config.id)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Base Branch</p>
                      <p className="text-muted-foreground">{config.baseBranch}</p>
                    </div>
                    <div>
                      <p className="font-medium">Linear Workspace</p>
                      <p className="text-muted-foreground">{config.linearWorkspaceId}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <GitBranch className="h-4 w-4 mr-2" />
                Add Repository
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tools & Permissions</CardTitle>
              <CardDescription>
                Настройте доступные инструменты и права доступа для Cyrus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Code Tools</h4>
                  <div className="space-y-2">
                    {["Read(**)", "Edit(**)", "Bash(git:*)", "Bash(gh:*)"].map((tool) => (
                      <div key={tool} className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">AI Tools</h4>
                  <div className="space-y-2">
                    {["Task", "WebSearch", "WebFetch", "mcp__linear"].map((tool) => (
                      <div key={tool} className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Routing Rules</CardTitle>
              <CardDescription>
                Настройте правила маршрутизации issues по командам и проектам
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Team Routing</h4>
                  <div className="space-y-2">
                    {["BACKEND", "FRONTEND", "MOBILE"].map((team) => (
                      <div key={team} className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">{team}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Project Routing</h4>
                  <div className="space-y-2">
                    {["API Service", "Web Platform", "Mobile App"].map((project) => (
                      <div key={project} className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Label Routing</h4>
                  <div className="space-y-2">
                    {["backend", "frontend", "api", "bug", "feature"].map((label) => (
                      <div key={label} className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
              <CardDescription>
                Мониторинг активности Cyrus агента в реальном времени
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Agent Status</span>
                  <Badge variant={status.isRunning ? "default" : "secondary"}>
                    {status.isRunning ? "Running" : "Stopped"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing Queue</span>
                    <span>{status.activeIssues} issues</span>
                  </div>
                  <Progress value={(status.activeIssues / 10) * 100} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recent Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Processed issue CEE-123: Fix authentication bug</span>
                      <span className="text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span>Started processing issue CEE-124: Add user profile</span>
                      <span className="text-muted-foreground">5 min ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>Error processing issue CEE-125: Database connection failed</span>
                      <span className="text-muted-foreground">10 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
