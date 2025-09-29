"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { QueueManagement } from "@/components/dashboard/queue-management"
import { RepositoryManagement } from "@/components/dashboard/repository-management"
import { AgentConfiguration } from "@/components/dashboard/agent-configuration"
import { AutonomousOrchestrator } from "@/components/dashboard/autonomous-orchestrator"
import { MonitoringAnalytics } from "@/components/dashboard/monitoring-analytics"
import { CyrusIntegration } from "@/components/dashboard/cyrus-integration"
import { useCodegenContext } from "@/components/providers/codegen-provider"
import {
  Settings,
  Activity,
  Clock,
  GitBranch,
  Users,
  Shield,
  Zap,
  Brain,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Plus,
  RefreshCw
} from "lucide-react"

export default function Dashboard() {
  const { isConfigured, config } = useCodegenContext()
  const [activeTab, setActiveTab] = useState("overview")

  if (!isConfigured) {
    return <ConfigurationRequired />
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Codegen Agent Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Connected
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Queue
          </TabsTrigger>
          <TabsTrigger value="repositories" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Repositories
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="cyrus" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Cyrus
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Create Review"
              description="Start automated code review"
              icon={<Activity className="h-8 w-8" />}
              action="Create"
              color="blue"
            />
            <QuickActionCard
              title="Auto Fix"
              description="Fix issues automatically"
              icon={<Zap className="h-8 w-8" />}
              action="Fix"
              color="green"
            />
            <QuickActionCard
              title="Deploy"
              description="Deploy to production"
              icon={<RefreshCw className="h-8 w-8" />}
              action="Deploy"
              color="purple"
            />
            <QuickActionCard
              title="Monitor"
              description="Start monitoring"
              icon={<Shield className="h-8 w-8" />}
              action="Monitor"
              color="orange"
            />
          </div>
          <StatsOverview />
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <QueueManagement />
        </TabsContent>

        <TabsContent value="repositories" className="space-y-4">
          <RepositoryManagement />
        </TabsContent>

            <TabsContent value="agents" className="space-y-4">
              <div className="space-y-6">
                <AgentConfiguration />
                <AutonomousOrchestrator />
              </div>
            </TabsContent>

            <TabsContent value="cyrus" className="space-y-4">
              <CyrusIntegration />
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <MonitoringAnalytics />
            </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ConfigurationRequired() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            Configuration Required
          </CardTitle>
          <CardDescription>
            Please configure your Codegen API connection to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <input
              type="password"
              placeholder="Enter your Codegen API key"
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Base URL</label>
            <input
              type="url"
              placeholder="https://api.codegen.com"
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Repository ID</label>
            <input
              type="text"
              placeholder="repository-id"
              className="w-full px-3 py-2 border border-input rounded-md"
            />
          </div>
          <Button className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  action: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function QuickActionCard({ title, description, icon, action, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 hover:bg-blue-200',
    green: 'text-green-600 bg-green-100 hover:bg-green-200',
    purple: 'text-purple-600 bg-purple-100 hover:bg-purple-200',
    orange: 'text-orange-600 bg-orange-100 hover:bg-orange-200',
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${colorClasses[color]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <Button size="sm" className="w-full">
          <Plus className="h-3 w-3 mr-1" />
          {action}
        </Button>
      </CardContent>
    </Card>
  )
}


function SecurityView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </CardTitle>
        <CardDescription>
          Security scanning and vulnerability management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Security dashboard will be implemented here.</p>
          <p className="text-sm">Monitor security issues and vulnerabilities.</p>
        </div>
      </CardContent>
    </Card>
  )
}
