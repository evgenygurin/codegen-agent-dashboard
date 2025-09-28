"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useQueue,
  useQueuedTask,
  useAddToQueue,
  useCancelQueuedTask,
  useQueueControls
} from "@/lib/hooks/use-codegen"
import {
  formatDuration,
  formatRelativeTime,
  getStatusColor,
  getPriorityColor,
  getActionIcon
} from "@/lib/utils"
import {
  Play,
  Pause,
  Square,
  Trash2,
  Plus,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react"
import type { QueuedTask } from "@/lib/types/codegen"

interface QueueManagementProps {
  className?: string
}

export function QueueManagement({ className }: QueueManagementProps) {
  const { data: queue, isLoading, error, refetch } = useQueue()
  const { pauseQueue, resumeQueue, clearQueue } = useQueueControls()
  const addToQueue = useAddToQueue()
  const cancelTask = useCancelQueuedTask()

  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const getTasksByStatus = (status: string) => {
    return queue?.filter(task => task.status === status) || []
  }

  const queuedTasks = getTasksByStatus('queued')
  const runningTasks = getTasksByStatus('running')
  const completedTasks = getTasksByStatus('completed')
  const failedTasks = getTasksByStatus('failed')

  const handlePauseQueue = async () => {
    try {
      await pauseQueue.mutateAsync()
    } catch (error) {
      console.error('Failed to pause queue:', error)
    }
  }

  const handleResumeQueue = async () => {
    try {
      await resumeQueue.mutateAsync()
    } catch (error) {
      console.error('Failed to resume queue:', error)
    }
  }

  const handleClearQueue = async () => {
    if (confirm('Are you sure you want to clear all completed and failed tasks from the queue?')) {
      try {
        await clearQueue.mutateAsync()
      } catch (error) {
        console.error('Failed to clear queue:', error)
      }
    }
  }

  const handleCancelTask = async (taskId: string) => {
    if (confirm('Are you sure you want to cancel this task?')) {
      try {
        await cancelTask.mutateAsync(taskId)
      } catch (error) {
        console.error('Failed to cancel task:', error)
      }
    }
  }

  const handleAddTask = async (type: string) => {
    try {
      await addToQueue.mutateAsync({
        type: type as any,
        priority: 'medium',
        title: `New ${type} task`,
        description: `Automatically created ${type} task`,
        repositoryId: 'default',
        estimatedDuration: 300000, // 5 minutes
        progress: 0,
        dependencies: [],
        metadata: {},
        logs: []
      })
    } catch (error) {
      console.error('Failed to add task to queue:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Queue Management</CardTitle>
          <CardDescription>Loading queue status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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
          <CardTitle className="text-destructive">Queue Error</CardTitle>
          <CardDescription>
            Failed to load queue information. Please try again.
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
              <Clock className="h-5 w-5" />
              Queue Management
            </CardTitle>
            <CardDescription>
              Manage and monitor automated tasks and workflows
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePauseQueue}
              disabled={pauseQueue.isPending}
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResumeQueue}
              disabled={resumeQueue.isPending}
            >
              <Play className="h-4 w-4 mr-1" />
              Resume
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearQueue}
              disabled={clearQueue.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => refetch()}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{queuedTasks.length}</div>
            <div className="text-sm text-muted-foreground">Queued</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{runningTasks.length}</div>
            <div className="text-sm text-muted-foreground">Running</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failedTasks.length}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({queue?.length || 0})</TabsTrigger>
            <TabsTrigger value="queued">Queued ({queuedTasks.length})</TabsTrigger>
            <TabsTrigger value="running">Running ({runningTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            <TabsTrigger value="failed">Failed ({failedTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <TaskList
              tasks={queue || []}
              onCancel={handleCancelTask}
              onSelect={setSelectedTask}
              selectedTask={selectedTask}
            />
          </TabsContent>

          <TabsContent value="queued" className="space-y-4">
            <TaskList
              tasks={queuedTasks}
              onCancel={handleCancelTask}
              onSelect={setSelectedTask}
              selectedTask={selectedTask}
            />
          </TabsContent>

          <TabsContent value="running" className="space-y-4">
            <TaskList
              tasks={runningTasks}
              onCancel={handleCancelTask}
              onSelect={setSelectedTask}
              selectedTask={selectedTask}
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <TaskList
              tasks={completedTasks}
              onCancel={handleCancelTask}
              onSelect={setSelectedTask}
              selectedTask={selectedTask}
            />
          </TabsContent>

          <TabsContent value="failed" className="space-y-4">
            <TaskList
              tasks={failedTasks}
              onCancel={handleCancelTask}
              onSelect={setSelectedTask}
              selectedTask={selectedTask}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex gap-2">
          <Button size="sm" onClick={() => handleAddTask('review')} disabled={addToQueue.isPending}>
            <Plus className="h-4 w-4 mr-1" />
            Add Review Task
          </Button>
          <Button size="sm" onClick={() => handleAddTask('fix')} disabled={addToQueue.isPending}>
            <Plus className="h-4 w-4 mr-1" />
            Add Fix Task
          </Button>
          <Button size="sm" onClick={() => handleAddTask('test')} disabled={addToQueue.isPending}>
            <Plus className="h-4 w-4 mr-1" />
            Add Test Task
          </Button>
          <Button size="sm" onClick={() => handleAddTask('deploy')} disabled={addToQueue.isPending}>
            <Plus className="h-4 w-4 mr-1" />
            Add Deploy Task
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface TaskListProps {
  tasks: QueuedTask[]
  onCancel: (taskId: string) => void
  onSelect: (taskId: string) => void
  selectedTask: string | null
}

function TaskList({ tasks, onCancel, onSelect, selectedTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks in this category
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onCancel={onCancel}
          onSelect={onSelect}
          isSelected={selectedTask === task.id}
        />
      ))}
    </div>
  )
}

interface TaskItemProps {
  task: QueuedTask
  onCancel: (taskId: string) => void
  onSelect: (taskId: string) => void
  isSelected: boolean
}

function TaskItem({ task, onCancel, onSelect, isSelected }: TaskItemProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
      }`}
      onClick={() => onSelect(task.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getStatusIcon(task.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium truncate">{task.title}</h4>
              <span className="text-xs">{getActionIcon(task.type)}</span>
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Repository: {task.repositoryId}</span>
              <span>Created: {formatRelativeTime(task.createdAt)}</span>
              {task.estimatedDuration && (
                <span>Est. duration: {formatDuration(task.estimatedDuration)}</span>
              )}
              {task.actualDuration && (
                <span>Actual duration: {formatDuration(task.actualDuration)}</span>
              )}
            </div>
            {task.progress > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {(task.status === 'queued' || task.status === 'running') && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onCancel(task.id)
              }}
            >
              <Square className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          )}
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}