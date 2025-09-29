"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Play,
  Pause,
  Square,
  RefreshCw,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  GitBranch,
  AlertTriangle,
  TrendingUp,
  BarChart3
} from "lucide-react"
import {
  useQueue,
  useAddToQueue,
  useQueueControls,
  useDashboardStats
} from "@/lib/hooks/use-codegen"
import { formatDuration, formatRelativeTime } from "@/lib/utils"

interface AutonomousOrchestratorProps {
  className?: string
}

export function AutonomousOrchestrator({ className }: AutonomousOrchestratorProps) {
  const { data: queue, isLoading, error, refetch } = useQueue()
  const { data: stats } = useDashboardStats()
  const addToQueue = useAddToQueue()
  const { pauseQueue, resumeQueue, clearQueue } = useQueueControls()

  const [isRunning, setIsRunning] = useState(false)
  const [currentWorkflow, setCurrentWorkflow] = useState<string | null>(null)
  const [workflowProgress, setWorkflowProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  // Simulate autonomous workflow execution
  useEffect(() => {
    if (isRunning && queue?.length) {
      const interval = setInterval(() => {
        setWorkflowProgress(prev => {
          if (prev >= 100) {
            setIsRunning(false)
            setCurrentWorkflow(null)
            return 0
          }
          return prev + Math.random() * 10
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isRunning, queue])

  const handleStartAutonomousWorkflow = async () => {
    setIsRunning(true)
    setCurrentWorkflow("autonomous-development")
    setWorkflowProgress(0)

    // Add initial tasks to the queue
    const tasks = [
      {
        type: 'review' as const,
        priority: 'high' as const,
        title: 'Automated Code Review',
        description: 'Review recent changes and identify issues',
        repositoryId: 'default',
        estimatedDuration: 300000, // 5 minutes
        progress: 0,
        dependencies: [],
        metadata: { autonomous: true },
        logs: []
      },
      {
        type: 'fix' as const,
        priority: 'high' as const,
        title: 'Auto-fix Issues',
        description: 'Automatically fix identified issues',
        repositoryId: 'default',
        estimatedDuration: 600000, // 10 minutes
        progress: 0,
        dependencies: ['review'],
        metadata: { autonomous: true },
        logs: []
      },
      {
        type: 'test' as const,
        priority: 'medium' as const,
        title: 'Generate Tests',
        description: 'Create comprehensive test coverage',
        repositoryId: 'default',
        estimatedDuration: 900000, // 15 minutes
        progress: 0,
        dependencies: ['fix'],
        metadata: { autonomous: true },
        logs: []
      },
      {
        type: 'optimize' as const,
        priority: 'medium' as const,
        title: 'Performance Optimization',
        description: 'Optimize code for better performance',
        repositoryId: 'default',
        estimatedDuration: 1200000, // 20 minutes
        progress: 0,
        dependencies: ['test'],
        metadata: { autonomous: true },
        logs: []
      }
    ]

    for (const task of tasks) {
      try {
        await addToQueue.mutateAsync(task)
      } catch (error) {
        console.error('Failed to add task to queue:', error)
      }
    }
  }

  const handleStopAutonomousWorkflow = () => {
    setIsRunning(false)
    setCurrentWorkflow(null)
    setWorkflowProgress(0)
  }

  const handlePauseWorkflow = async () => {
    try {
      await pauseQueue.mutateAsync()
    } catch (error) {
      console.error('Failed to pause workflow:', error)
    }
  }

  const handleResumeWorkflow = async () => {
    try {
      await resumeQueue.mutateAsync()
    } catch (error) {
      console.error('Failed to resume workflow:', error)
    }
  }

  const autonomousTasks = queue?.filter(task => task.metadata?.autonomous) || []
  const completedTasks = autonomousTasks.filter(task => task.status === 'completed')
  const runningTasks = autonomousTasks.filter(task => task.status === 'running')
  const queuedTasks = autonomousTasks.filter(task => task.status === 'queued')

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Autonomous Development Orchestrator
            </CardTitle>
            <CardDescription>
              AI-powered autonomous development workflows and task orchestration
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator isRunning={isRunning} />
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab
              isRunning={isRunning}
              currentWorkflow={currentWorkflow}
              workflowProgress={workflowProgress}
              onStart={handleStartAutonomousWorkflow}
              onStop={handleStopAutonomousWorkflow}
              onPause={handlePauseWorkflow}
              onResume={handleResumeWorkflow}
              autonomousTasks={autonomousTasks}
              completedTasks={completedTasks}
              runningTasks={runningTasks}
              queuedTasks={queuedTasks}
            />
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <WorkflowsTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab stats={stats} autonomousTasks={autonomousTasks} />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <LogsTab autonomousTasks={autonomousTasks} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface OverviewTabProps {
  isRunning: boolean
  currentWorkflow: string | null
  workflowProgress: number
  onStart: () => void
  onStop: () => void
  onPause: () => void
  onResume: () => void
  autonomousTasks: any[]
  completedTasks: any[]
  runningTasks: any[]
  queuedTasks: any[]
}

function OverviewTab({
  isRunning,
  currentWorkflow,
  workflowProgress,
  onStart,
  onStop,
  onPause,
  onResume,
  autonomousTasks,
  completedTasks,
  runningTasks,
  queuedTasks
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Autonomous Workflow Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isRunning ? (
                <>
                  <Button onClick={onStop} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                  <Button onClick={onPause} variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                </>
              ) : (
                <Button onClick={onStart}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Autonomous Workflow
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isRunning ? "default" : "secondary"}>
                {isRunning ? "Running" : "Stopped"}
              </Badge>
            </div>
          </div>

          {isRunning && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Workflow Progress</span>
                <span>{Math.round(workflowProgress)}%</span>
              </div>
              <Progress value={workflowProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={autonomousTasks.length}
          icon={<Activity className="h-4 w-4" />}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={completedTasks.length}
          icon={<CheckCircle className="h-4 w-4" />}
          color="green"
        />
        <StatCard
          title="Running"
          value={runningTasks.length}
          icon={<RefreshCw className="h-4 w-4" />}
          color="yellow"
        />
        <StatCard
          title="Queued"
          value={queuedTasks.length}
          icon={<Clock className="h-4 w-4" />}
          color="gray"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Autonomous Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {autonomousTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No autonomous tasks yet</p>
              <p className="text-sm">Start an autonomous workflow to see activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {autonomousTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      {getTaskIcon(task.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    {task.progress > 0 && (
                      <div className="w-16">
                        <Progress value={task.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function WorkflowsTab() {
  const predefinedWorkflows = [
    {
      id: 'full-cycle',
      name: 'Full Development Cycle',
      description: 'Complete autonomous development from review to deployment',
      tasks: ['Review', 'Fix', 'Test', 'Optimize', 'Deploy'],
      estimatedDuration: '45 minutes',
      icon: <GitBranch className="h-5 w-5" />
    },
    {
      id: 'quick-review',
      name: 'Quick Review & Fix',
      description: 'Fast review and automatic fixes for urgent issues',
      tasks: ['Review', 'Fix'],
      estimatedDuration: '10 minutes',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'testing-only',
      name: 'Test Generation',
      description: 'Generate comprehensive tests for existing code',
      tasks: ['Test', 'Document'],
      estimatedDuration: '20 minutes',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      id: 'optimization',
      name: 'Performance Optimization',
      description: 'Focus on code optimization and performance improvements',
      tasks: ['Analyze', 'Optimize', 'Test'],
      estimatedDuration: '30 minutes',
      icon: <TrendingUp className="h-5 w-5" />
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Predefined Workflows</h3>
        <p className="text-sm text-muted-foreground">
          Choose from predefined autonomous development workflows
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {predefinedWorkflows.map((workflow) => (
          <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    {workflow.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <CardDescription className="text-sm">{workflow.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">{workflow.estimatedDuration}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {workflow.tasks.map((task, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {task}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" className="w-full mt-3">
                  <Play className="h-3 w-3 mr-1" />
                  Run Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface AnalyticsTabProps {
  stats: any
  autonomousTasks: any[]
}

function AnalyticsTab({ stats, autonomousTasks }: AnalyticsTabProps) {
  const completionRate = autonomousTasks.length > 0 
    ? (autonomousTasks.filter(task => task.status === 'completed').length / autonomousTasks.length) * 100
    : 0

  const averageCompletionTime = autonomousTasks
    .filter(task => task.status === 'completed' && task.actualDuration)
    .reduce((acc, task) => acc + task.actualDuration, 0) / 
    Math.max(autonomousTasks.filter(task => task.status === 'completed' && task.actualDuration).length, 1)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Autonomous Development Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Performance metrics and insights from autonomous workflows
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Completion Rate"
          value={`${completionRate.toFixed(1)}%`}
          icon={<CheckCircle className="h-4 w-4" />}
          color="green"
        />
        <StatCard
          title="Avg Completion Time"
          value={formatDuration(averageCompletionTime)}
          icon={<Clock className="h-4 w-4" />}
          color="blue"
        />
        <StatCard
          title="Tasks Processed"
          value={autonomousTasks.length}
          icon={<BarChart3 className="h-4 w-4" />}
          color="purple"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Performance charts will be displayed here</p>
            <p className="text-sm">Track trends over time as more data becomes available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface LogsTabProps {
  autonomousTasks: any[]
}

function LogsTab({ autonomousTasks }: LogsTabProps) {
  const allLogs = autonomousTasks
    .flatMap(task => task.logs?.map((log: any) => ({ ...log, taskId: task.id, taskTitle: task.title })) || [])
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Autonomous Workflow Logs</h3>
        <p className="text-sm text-muted-foreground">
          Detailed logs from autonomous development workflows
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {allLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No logs available</p>
              <p className="text-sm">Logs will appear here as autonomous workflows run</p>
            </div>
          ) : (
            <div className="space-y-0">
              {allLogs.slice(0, 50).map((log, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border-b last:border-b-0">
                  <div className="flex-shrink-0 mt-1">
                    {getLogIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {log.taskTitle}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {log.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'gray'
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
    gray: 'text-gray-600 bg-gray-100'
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2 rounded-md ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatusIndicatorProps {
  isRunning: boolean
}

function StatusIndicator({ isRunning }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      <span className="text-sm text-muted-foreground">
        {isRunning ? 'Active' : 'Inactive'}
      </span>
    </div>
  )
}

function getTaskIcon(type: string) {
  switch (type) {
    case 'review': return <Activity className="h-4 w-4" />
    case 'fix': return <Zap className="h-4 w-4" />
    case 'test': return <CheckCircle className="h-4 w-4" />
    case 'optimize': return <TrendingUp className="h-4 w-4" />
    default: return <Brain className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'running': return 'bg-blue-100 text-blue-800'
    case 'failed': return 'bg-red-100 text-red-800'
    case 'queued': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getLogIcon(level: string) {
  switch (level) {
    case 'error': return <XCircle className="h-4 w-4 text-red-500" />
    case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'info': return <Activity className="h-4 w-4 text-blue-500" />
    default: return <Activity className="h-4 w-4 text-gray-500" />
  }
}
