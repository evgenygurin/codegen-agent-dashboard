"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Zap,
  Brain,
  GitBranch,
  Shield
} from "lucide-react"
import {
  useDashboardStats,
  useSystemHealth,
  useQueue
} from "@/lib/hooks/use-codegen"
import { formatDuration, formatRelativeTime } from "@/lib/utils"

interface MonitoringAnalyticsProps {
  className?: string
}

export function MonitoringAnalytics({ className }: MonitoringAnalyticsProps) {
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats()
  const { data: systemHealth, isLoading: healthLoading, refetch: refetchHealth } = useSystemHealth()
  const { data: queue, isLoading: queueLoading, refetch: refetchQueue } = useQueue()

  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("7d")

  const handleRefresh = () => {
    refetchStats()
    refetchHealth()
    refetchQueue()
  }

  const handleExport = () => {
    // Export analytics data
    console.log('Exporting analytics data...')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monitoring & Analytics
            </CardTitle>
            <CardDescription>
              Real-time monitoring, performance metrics, and system analytics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-input rounded-md text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab 
              stats={stats} 
              systemHealth={systemHealth}
              queue={queue}
              isLoading={statsLoading || healthLoading || queueLoading}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceTab stats={stats} isLoading={statsLoading} />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <SystemHealthTab systemHealth={systemHealth} isLoading={healthLoading} />
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <WorkflowsTab stats={stats} queue={queue} isLoading={statsLoading || queueLoading} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface OverviewTabProps {
  stats: any
  systemHealth: any
  queue: any
  isLoading: boolean
}

function OverviewTab({ stats, systemHealth, queue, isLoading }: OverviewTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const keyMetrics = [
    {
      title: "Success Rate",
      value: `${stats?.successRate?.toFixed(1) || 0}%`,
      change: "+5.2%",
      trend: "up",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "green"
    },
    {
      title: "Active Tasks",
      value: queue?.filter((task: any) => task.status === 'running').length || 0,
      change: "+12",
      trend: "up",
      icon: <Activity className="h-4 w-4" />,
      color: "blue"
    },
    {
      title: "Avg Response Time",
      value: `${Math.round((stats?.averageCompletionTime || 0) / 1000)}s`,
      change: "-15%",
      trend: "down",
      icon: <Clock className="h-4 w-4" />,
      color: "purple"
    },
    {
      title: "System Health",
      value: systemHealth?.status === 'healthy' ? 'Healthy' : 'Warning',
      change: systemHealth?.status === 'healthy' ? 'Stable' : 'Issues',
      trend: systemHealth?.status === 'healthy' ? "up" : "down",
      icon: <Shield className="h-4 w-4" />,
      color: systemHealth?.status === 'healthy' ? "green" : "yellow"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`p-2 rounded-md ${
                  metric.color === 'green' ? 'text-green-600 bg-green-100' :
                  metric.color === 'blue' ? 'text-blue-600 bg-blue-100' :
                  metric.color === 'purple' ? 'text-purple-600 bg-purple-100' :
                  'text-yellow-600 bg-yellow-100'
                }`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.performanceMetrics?.checksPerDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="passed"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  name="Passed Checks"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  name="Failed Checks"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentActivity?.slice(0, 5).map((activity: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'pr_created' && <GitBranch className="h-4 w-4 text-blue-500" />}
                  {activity.type === 'check_completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.type === 'action_completed' && <Zap className="h-4 w-4 text-purple-500" />}
                  {activity.type === 'error_occurred' && <XCircle className="h-4 w-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity.timestamp)} • {activity.repositoryId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface PerformanceTabProps {
  stats: any
  isLoading: boolean
}

function PerformanceTab({ stats, isLoading }: PerformanceTabProps) {
  if (isLoading) {
    return <div className="animate-pulse space-y-4">Loading performance data...</div>
  }

  const performanceData = [
    { name: 'Checks Per Day', value: stats?.totalChecks || 0, color: '#3b82f6' },
    { name: 'Actions Completed', value: stats?.completedActions || 0, color: '#10b981' },
    { name: 'Pull Requests', value: stats?.totalPullRequests || 0, color: '#f59e0b' },
    { name: 'Repositories', value: stats?.totalRepositories || 0, color: '#8b5cf6' }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.performanceMetrics?.averageResponseTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metric</th>
                  <th className="text-right py-2">Current</th>
                  <th className="text-right py-2">Average</th>
                  <th className="text-right py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Check Success Rate</td>
                  <td className="text-right py-2">{stats?.successRate?.toFixed(1)}%</td>
                  <td className="text-right py-2">87.3%</td>
                  <td className="text-right py-2">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">+2.1%</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Average Response Time</td>
                  <td className="text-right py-2">{formatDuration(stats?.averageCompletionTime || 0)}</td>
                  <td className="text-right py-2">2.3s</td>
                  <td className="text-right py-2">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingDown className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">-15%</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Queue Processing Rate</td>
                  <td className="text-right py-2">24.5/min</td>
                  <td className="text-right py-2">22.1/min</td>
                  <td className="text-right py-2">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">+10.9%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SystemHealthTabProps {
  systemHealth: any
  isLoading: boolean
}

function SystemHealthTab({ systemHealth, isLoading }: SystemHealthTabProps) {
  if (isLoading) {
    return <div className="animate-pulse space-y-4">Loading system health data...</div>
  }

  const healthChecks = [
    { name: 'API Health', status: 'healthy', responseTime: '45ms' },
    { name: 'Database', status: 'healthy', responseTime: '12ms' },
    { name: 'Queue System', status: 'warning', responseTime: '156ms' },
    { name: 'External APIs', status: 'healthy', responseTime: '89ms' },
    { name: 'Storage', status: 'healthy', responseTime: '23ms' }
  ]

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                systemHealth?.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="font-medium">
                System Status: {systemHealth?.status === 'healthy' ? 'Healthy' : 'Warning'}
              </span>
            </div>
            <Badge variant={systemHealth?.status === 'healthy' ? 'default' : 'secondary'}>
              {systemHealth?.status === 'healthy' ? 'All Systems Operational' : 'Minor Issues Detected'}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {healthChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{check.name}</p>
                  <p className="text-xs text-muted-foreground">Response: {check.responseTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    check.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-xs capitalize">{check.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { time: '00:00', cpu: 45 },
                  { time: '04:00', cpu: 38 },
                  { time: '08:00', cpu: 67 },
                  { time: '12:00', cpu: 82 },
                  { time: '16:00', cpu: 74 },
                  { time: '20:00', cpu: 56 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { time: '00:00', memory: 2.1 },
                  { time: '04:00', memory: 1.8 },
                  { time: '08:00', memory: 3.2 },
                  { time: '12:00', memory: 4.1 },
                  { time: '16:00', memory: 3.7 },
                  { time: '20:00', memory: 2.9 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="memory" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface WorkflowsTabProps {
  stats: any
  queue: any
  isLoading: boolean
}

function WorkflowsTab({ stats, queue, isLoading }: WorkflowsTabProps) {
  if (isLoading) {
    return <div className="animate-pulse space-y-4">Loading workflow data...</div>
  }

  const workflowStats = [
    { name: 'Review Workflows', count: 45, success: 42, color: '#3b82f6' },
    { name: 'Fix Workflows', count: 32, success: 28, color: '#10b981' },
    { name: 'Test Workflows', count: 28, success: 26, color: '#f59e0b' },
    { name: 'Optimize Workflows', count: 15, success: 14, color: '#8b5cf6' }
  ]

  return (
    <div className="space-y-6">
      {/* Workflow Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Workflow Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workflowStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Total Workflows" />
                <Bar dataKey="success" fill="#10b981" name="Successful" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {workflowStats.map((workflow, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{workflow.name}</p>
                  <p className="text-xl font-bold">{workflow.success}/{workflow.count}</p>
                  <p className="text-xs text-muted-foreground">
                    {((workflow.success / workflow.count) * 100).toFixed(1)}% success rate
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: workflow.color + '20' }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: workflow.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AlertsTab() {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High Queue Processing Time',
      message: 'Queue processing time has exceeded 5 minutes',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      resolved: false
    },
    {
      id: 2,
      type: 'error',
      title: 'API Rate Limit Exceeded',
      message: 'External API rate limit has been exceeded',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      resolved: true
    },
    {
      id: 3,
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance will occur in 2 hours',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      resolved: false
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${
                alert.resolved ? 'bg-muted/50' : ''
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {alert.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                      {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {alert.type === 'info' && <Activity className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        {alert.resolved && (
                          <Badge variant="secondary" className="text-xs">Resolved</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button size="sm" variant="outline">
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
