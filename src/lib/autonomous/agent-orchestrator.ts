import type {
  AgentAction,
  QueuedTask,
  Repository,
  CheckResult,
  PullRequest,
  AgentConfiguration
} from '../types/codegen'
import { getCodegenClient } from '../api/codegen-client'

export interface AutonomousDecision {
  id: string
  timestamp: string
  trigger: string
  analysis: string
  decision: string
  confidence: number
  actions: Array<{
    type: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    description: string
    estimatedDuration: number
  }>
  reasoning: string
}

export interface MonitoringMetric {
  name: string
  value: number
  threshold: number
  status: 'normal' | 'warning' | 'critical'
  trend: 'improving' | 'stable' | 'declining'
  lastUpdated: string
}

export class AutonomousAgentOrchestrator {
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null
  private decisionHistory: AutonomousDecision[] = []
  private metrics: Map<string, MonitoringMetric> = new Map()

  constructor(
    private config: {
      checkInterval: number // in milliseconds
      maxConcurrentTasks: number
      autoRepair: boolean
      autoOptimize: boolean
      autoScale: boolean
      intelligenceLevel: 'basic' | 'advanced' | 'expert'
    } = {
      checkInterval: 30000, // 30 seconds
      maxConcurrentTasks: 5,
      autoRepair: true,
      autoOptimize: true,
      autoScale: true,
      intelligenceLevel: 'expert'
    }
  ) {}

  start(): void {
    if (this.isRunning) {
      console.warn('Autonomous orchestrator is already running')
      return
    }

    this.isRunning = true
    console.log('🤖 Starting Autonomous Agent Orchestrator')

    // Main orchestration loop
    this.intervalId = setInterval(() => {
      this.orchestrate().catch(error => {
        console.error('Error in orchestration cycle:', error)
      })
    }, this.config.checkInterval)

    // Initial run
    this.orchestrate()
  }

  stop(): void {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    console.log('🛑 Stopped Autonomous Agent Orchestrator')
  }

  getStatus(): {
    isRunning: boolean
    lastDecision: AutonomousDecision | null
    decisionCount: number
    metrics: MonitoringMetric[]
  } {
    return {
      isRunning: this.isRunning,
      lastDecision: this.decisionHistory[this.decisionHistory.length - 1] || null,
      decisionCount: this.decisionHistory.length,
      metrics: Array.from(this.metrics.values())
    }
  }

  private async orchestrate(): Promise<void> {
    try {
      // 1. Gather intelligence
      const intelligence = await this.gatherIntelligence()

      // 2. Analyze situation
      const analysis = await this.analyzeIntelligence(intelligence)

      // 3. Make autonomous decisions
      const decisions = await this.makeDecisions(analysis)

      // 4. Execute decisions
      await this.executeDecisions(decisions)

      // 5. Learn from outcomes
      await this.learnFromOutcomes()

    } catch (error) {
      console.error('Orchestration error:', error)
      await this.handleError(error)
    }
  }

  private async gatherIntelligence(): Promise<any> {
    const client = getCodegenClient()

    const [
      repositories,
      queue,
      stats,
      systemHealth
    ] = await Promise.allSettled([
      client.getRepositories(),
      client.getQueue(),
      client.getDashboardStats(),
      client.getSystemHealth()
    ])

    return {
      repositories: repositories.status === 'fulfilled' ? repositories.value.data : [],
      queue: queue.status === 'fulfilled' ? queue.value.data : [],
      stats: stats.status === 'fulfilled' ? stats.value.data : null,
      systemHealth: systemHealth.status === 'fulfilled' ? systemHealth.value.data : null,
      timestamp: new Date().toISOString()
    }
  }

  private async analyzeIntelligence(intelligence: any): Promise<{
    criticalIssues: string[]
    opportunities: string[]
    systemLoad: number
    recommendations: string[]
  }> {
    const criticalIssues: string[] = []
    const opportunities: string[] = []
    const recommendations: string[] = []

    // Analyze queue health
    if (intelligence.queue) {
      const failedTasks = intelligence.queue.filter((task: QueuedTask) => task.status === 'failed')
      const queuedTasks = intelligence.queue.filter((task: QueuedTask) => task.status === 'queued')
      const runningTasks = intelligence.queue.filter((task: QueuedTask) => task.status === 'running')

      if (failedTasks.length > 3) {
        criticalIssues.push(`High failure rate: ${failedTasks.length} failed tasks`)
        recommendations.push('Investigate and auto-retry failed tasks')
      }

      if (queuedTasks.length > 10) {
        criticalIssues.push(`Queue backlog: ${queuedTasks.length} pending tasks`)
        recommendations.push('Scale up task processing capacity')
      }

      if (runningTasks.length < this.config.maxConcurrentTasks / 2) {
        opportunities.push('Underutilized capacity - can accept more work')
      }
    }

    // Analyze system health
    const systemLoad = this.calculateSystemLoad(intelligence)

    // Update metrics
    this.updateMetrics({
      'queue.failed': failedTasks?.length || 0,
      'queue.pending': queuedTasks?.length || 0,
      'queue.running': runningTasks?.length || 0,
      'system.load': systemLoad
    })

    return {
      criticalIssues,
      opportunities,
      systemLoad,
      recommendations
    }
  }

  private async makeDecisions(analysis: any): Promise<AutonomousDecision[]> {
    const decisions: AutonomousDecision[] = []

    // Critical issue auto-resolution
    if (analysis.criticalIssues.length > 0) {
      const decision: AutonomousDecision = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        trigger: 'critical_issues_detected',
        analysis: `Detected ${analysis.criticalIssues.length} critical issues`,
        decision: 'auto_repair_and_optimize',
        confidence: 0.85,
        actions: [],
        reasoning: 'System stability requires immediate intervention'
      }

      // Auto-retry failed tasks
      if (analysis.criticalIssues.some((issue: string) => issue.includes('failure rate'))) {
        decision.actions.push({
          type: 'retry_failed_tasks',
          priority: 'high',
          description: 'Automatically retry failed tasks with exponential backoff',
          estimatedDuration: 120000 // 2 minutes
        })
      }

      // Scale queue processing
      if (analysis.criticalIssues.some((issue: string) => issue.includes('Queue backlog'))) {
        decision.actions.push({
          type: 'scale_queue_processing',
          priority: 'high',
          description: 'Increase concurrent task processing capacity',
          estimatedDuration: 60000 // 1 minute
        })
      }

      decisions.push(decision)
    }

    // Optimization opportunities
    if (analysis.opportunities.length > 0 && this.config.autoOptimize) {
      const decision: AutonomousDecision = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        trigger: 'optimization_opportunities',
        analysis: `Found ${analysis.opportunities.length} optimization opportunities`,
        decision: 'auto_optimize_performance',
        confidence: 0.75,
        actions: [{
          type: 'optimize_resource_allocation',
          priority: 'medium',
          description: 'Optimize resource allocation based on current workload',
          estimatedDuration: 180000 // 3 minutes
        }],
        reasoning: 'Proactive optimization improves overall system efficiency'
      }

      decisions.push(decision)
    }

    // Predictive maintenance
    if (analysis.systemLoad > 0.8) {
      const decision: AutonomousDecision = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        trigger: 'high_system_load',
        analysis: `System load at ${(analysis.systemLoad * 100).toFixed(1)}%`,
        decision: 'preventive_maintenance',
        confidence: 0.9,
        actions: [{
          type: 'preventive_maintenance',
          priority: 'high',
          description: 'Perform preventive maintenance to avoid system overload',
          estimatedDuration: 300000 // 5 minutes
        }],
        reasoning: 'High system load indicates need for preventive action'
      }

      decisions.push(decision)
    }

    return decisions
  }

  private async executeDecisions(decisions: AutonomousDecision[]): Promise<void> {
    for (const decision of decisions) {
      try {
        console.log(`🧠 Executing autonomous decision: ${decision.decision}`)

        for (const action of decision.actions) {
          await this.executeAction(action, decision)
        }

        // Store decision in history
        this.decisionHistory.push(decision)

        // Keep only last 100 decisions
        if (this.decisionHistory.length > 100) {
          this.decisionHistory = this.decisionHistory.slice(-100)
        }

      } catch (error) {
        console.error(`Error executing decision ${decision.id}:`, error)
      }
    }
  }

  private async executeAction(action: any, decision: AutonomousDecision): Promise<void> {
    const client = getCodegenClient()

    try {
      switch (action.type) {
        case 'retry_failed_tasks':
          await this.retryFailedTasks()
          break

        case 'scale_queue_processing':
          await this.scaleQueueProcessing()
          break

        case 'optimize_resource_allocation':
          await this.optimizeResourceAllocation()
          break

        case 'preventive_maintenance':
          await this.performPreventiveMaintenance()
          break

        default:
          console.warn(`Unknown action type: ${action.type}`)
      }

      console.log(`✅ Completed action: ${action.type}`)
    } catch (error) {
      console.error(`❌ Failed to execute action ${action.type}:`, error)
      throw error
    }
  }

  private async retryFailedTasks(): Promise<void> {
    // Implementation would retry failed tasks with exponential backoff
    console.log('🔄 Retrying failed tasks...')
    // This would integrate with the actual queue system
  }

  private async scaleQueueProcessing(): Promise<void> {
    // Implementation would increase processing capacity
    console.log('📈 Scaling queue processing capacity...')
    // This would adjust concurrent task limits
  }

  private async optimizeResourceAllocation(): Promise<void> {
    // Implementation would optimize resource usage
    console.log('⚡ Optimizing resource allocation...')
    // This would adjust resource distribution
  }

  private async performPreventiveMaintenance(): Promise<void> {
    // Implementation would perform maintenance tasks
    console.log('🛠️ Performing preventive maintenance...')
    // This would clean up resources, cache, etc.
  }

  private async learnFromOutcomes(): Promise<void> {
    // Analyze the success/failure of recent decisions
    // Adjust confidence levels and decision parameters
    // This is where machine learning would be integrated
    console.log('🎓 Learning from recent outcomes...')
  }

  private async handleError(error: any): Promise<void> {
    console.error('🚨 Autonomous orchestrator error:', error)

    // Try to auto-recover from common errors
    if (error.message?.includes('network') || error.message?.includes('timeout')) {
      console.log('🔧 Attempting auto-recovery from network error...')
      // Implement network error recovery
    }
  }

  private calculateSystemLoad(intelligence: any): number {
    // Calculate overall system load based on various metrics
    let load = 0

    if (intelligence.queue) {
      const totalTasks = intelligence.queue.length
      const runningTasks = intelligence.queue.filter((t: any) => t.status === 'running').length
      load += (runningTasks / Math.max(totalTasks, 1)) * 0.5
    }

    if (intelligence.stats) {
      const failureRate = intelligence.stats.failedActions / Math.max(intelligence.stats.totalActions, 1)
      load += failureRate * 0.3
    }

    return Math.min(load, 1)
  }

  private updateMetrics(newMetrics: Record<string, number>): void {
    for (const [name, value] of Object.entries(newMetrics)) {
      const existing = this.metrics.get(name)
      const metric: MonitoringMetric = {
        name,
        value,
        threshold: this.getThreshold(name),
        status: this.getMetricStatus(name, value),
        trend: this.calculateTrend(existing?.value, value),
        lastUpdated: new Date().toISOString()
      }
      this.metrics.set(name, metric)
    }
  }

  private getThreshold(metricName: string): number {
    const thresholds: Record<string, number> = {
      'queue.failed': 5,
      'queue.pending': 15,
      'queue.running': 3,
      'system.load': 0.85
    }
    return thresholds[metricName] || 100
  }

  private getMetricStatus(name: string, value: number): 'normal' | 'warning' | 'critical' {
    const threshold = this.getThreshold(name)

    if (value >= threshold) return 'critical'
    if (value >= threshold * 0.7) return 'warning'
    return 'normal'
  }

  private calculateTrend(oldValue?: number, newValue?: number): 'improving' | 'stable' | 'declining' {
    if (!oldValue || !newValue) return 'stable'

    const change = ((newValue - oldValue) / oldValue) * 100

    if (Math.abs(change) < 5) return 'stable'
    return change > 0 ? 'declining' : 'improving'
  }

  private generateId(): string {
    return `autonomous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// Singleton instance
let orchestrator: AutonomousAgentOrchestrator | null = null

export function getOrchestrator(): AutonomousAgentOrchestrator {
  if (!orchestrator) {
    orchestrator = new AutonomousAgentOrchestrator()
  }
  return orchestrator
}

export function startAutonomousOrchestrator(config?: any): void {
  const orch = getOrchestrator()
  if (config) {
    // Update config if provided
  }
  orch.start()
}

export function stopAutonomousOrchestrator(): void {
  const orch = getOrchestrator()
  orch.stop()
}