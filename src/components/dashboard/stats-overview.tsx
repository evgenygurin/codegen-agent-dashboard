"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDashboardStats } from "@/lib/hooks/use-codegen"
import { formatPercentage, formatRelativeTime } from "@/lib/utils"
import {
  GitPullRequest,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Users,
  FileText
} from "lucide-react"

interface StatsOverviewProps {
  repositoryId?: string
  dateRange?: { from: string; to: string }
}

export function StatsOverview({ repositoryId, dateRange }: StatsOverviewProps) {
  const { data: stats, isLoading, error } = useDashboardStats(repositoryId, dateRange)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-2"></div>
              <div className="h-3 w-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Stats</CardTitle>
          <CardDescription>
            Failed to load dashboard statistics. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>
            No statistics available for the selected time range.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const statCards = [
    {
      title: "Total Repositories",
      value: stats.totalRepositories,
      description: `${stats.activeRepositories} active`,
      icon: Users,
      trend: stats.activeRepositories / stats.totalRepositories * 100,
    },
    {
      title: "Pull Requests",
      value: stats.totalPullRequests,
      description: `${stats.openPullRequests} open`,
      icon: GitPullRequest,
      trend: stats.openPullRequests,
    },
    {
      title: "Checks Passed",
      value: stats.passedChecks,
      description: `${formatPercentage(stats.passedChecks, stats.totalChecks)} success rate`,
      icon: CheckCircle,
      variant: "success" as const,
      trend: (stats.passedChecks / stats.totalChecks) * 100,
    },
    {
      title: "Checks Failed",
      value: stats.failedChecks,
      description: `${formatPercentage(stats.failedChecks, stats.totalChecks)} failure rate`,
      icon: XCircle,
      variant: "destructive" as const,
      trend: (stats.failedChecks / stats.totalChecks) * 100,
    },
    {
      title: "Actions Completed",
      value: stats.completedActions,
      description: `${formatPercentage(stats.completedActions, stats.totalActions)} completion rate`,
      icon: Activity,
      trend: (stats.completedActions / stats.totalActions) * 100,
    },
    {
      title: "Actions Failed",
      value: stats.failedActions,
      description: `${formatPercentage(stats.failedActions, stats.totalActions)} failure rate`,
      icon: XCircle,
      variant: "warning" as const,
      trend: (stats.failedActions / stats.totalActions) * 100,
    },
    {
      title: "Avg Completion Time",
      value: `${Math.round(stats.averageCompletionTime / 1000)}s`,
      description: "Average response time",
      icon: Clock,
      trend: stats.averageCompletionTime,
    },
    {
      title: "Success Rate",
      value: `${stats.successRate.toFixed(1)}%`,
      description: "Overall success rate",
      icon: TrendingUp,
      variant: stats.successRate > 90 ? "success" as const : stats.successRate > 70 ? "warning" as const : "destructive" as const,
      trend: stats.successRate,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                {stat.variant && (
                  <div className="mt-2">
                    <Badge variant={stat.variant}>
                      {stat.trend > 90 ? 'Excellent' :
                       stat.trend > 70 ? 'Good' :
                       stat.trend > 50 ? 'Average' : 'Needs Attention'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest events across your repositories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'pr_created' && <GitPullRequest className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'pr_merged' && <GitPullRequest className="h-4 w-4 text-green-500" />}
                    {activity.type === 'check_completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.type === 'action_completed' && <Activity className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'error_occurred' && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(activity.timestamp)} • Repository: {activity.repositoryId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}