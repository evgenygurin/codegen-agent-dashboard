export interface CodegenConfiguration {
  apiKey: string;
  baseUrl: string;
  repositoryId: string;
  organizationId: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  defaultBranch: string;
  htmlUrl: string;
  cloneUrl: string;
  sshUrl: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  size: number;
  stargazersCount: number;
  watchersCount: number;
  language?: string;
  forksCount: number;
  openIssuesCount: number;
  topics: string[];
  visibility: 'public' | 'private';
  archived: boolean;
  disabled: boolean;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed' | 'merged';
  draft: boolean;
  htmlUrl: string;
  diffUrl: string;
  patchUrl: string;
  mergeCommitSha?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  mergedAt?: string;
  head: {
    ref: string;
    sha: string;
    label: string;
  };
  base: {
    ref: string;
    sha: string;
    label: string;
  };
  user: {
    id: number;
    login: string;
    avatarUrl: string;
  };
  assignees: Array<{
    id: number;
    login: string;
    avatarUrl: string;
  }>;
  requestedReviewers: Array<{
    id: number;
    login: string;
    avatarUrl: string;
  }>;
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description?: string;
  }>;
  milestone?: {
    id: number;
    title: string;
    description?: string;
    state: 'open' | 'closed';
    number: number;
  };
  mergeable?: boolean;
  mergeableState: string;
  mergedBy?: {
    id: number;
    login: string;
    avatarUrl: string;
  };
  commitsCount: number;
  additionsCount: number;
  deletionsCount: number;
  changedFilesCount: number;
}

export interface CheckResult {
  id: string;
  name: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
  startedAt?: string;
  completedAt?: string;
  htmlUrl: string;
  detailsUrl?: string;
  output?: {
    title?: string;
    summary?: string;
    text?: string;
    annotationsCount: number;
    annotationsUrl?: string;
  };
  pullRequests: Array<{
    id: number;
    number: number;
    url: string;
    head: {
      ref: string;
      sha: string;
    };
    base: {
      ref: string;
      sha: string;
    };
  }>;
  app?: {
    id: number;
    slug: string;
    name: string;
  };
  checkSuite?: {
    id: number;
    headSha: string;
    status: string;
    conclusion?: string;
  };
}

export interface AgentAction {
  id: string;
  type: 'review' | 'fix' | 'improve' | 'optimize' | 'test' | 'document';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  triggeredBy: 'user' | 'webhook' | 'schedule' | 'auto';
  repositoryId: string;
  pullRequestId?: number;
  checkId?: string;
  metadata: Record<string, any>;
  result?: {
    success: boolean;
    message: string;
    changes?: Array<{
      file: string;
      additions: number;
      deletions: number;
      patch: string;
    }>;
    artifacts?: Array<{
      name: string;
      url: string;
      type: 'log' | 'report' | 'code' | 'image' | 'other';
    }>;
  };
}

export interface AgentConfiguration {
  autoReview: boolean;
  autoFix: boolean;
  autoOptimize: boolean;
  autoTest: boolean;
  autoDocument: boolean;
  reviewTriggers: Array<'pr_opened' | 'pr_updated' | 'push' | 'scheduled'>;
  fixTriggers: Array<'check_failed' | 'review_requested' | 'manual'>;
  schedules: Array<{
    name: string;
    cron: string;
    action: string;
    enabled: boolean;
  }>;
  filters: {
    includePaths: string[];
    excludePaths: string[];
    includeExtensions: string[];
    excludeExtensions: string[];
  };
  thresholds: {
    maxFilesPerAction: number;
    maxChangesPerFile: number;
    complexityThreshold: number;
    performanceThreshold: number;
  };
}

export interface DashboardStats {
  totalRepositories: number;
  activeRepositories: number;
  totalPullRequests: number;
  openPullRequests: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  totalActions: number;
  completedActions: number;
  failedActions: number;
  averageCompletionTime: number;
  successRate: number;
  recentActivity: Array<{
    id: string;
    type: 'pr_created' | 'pr_merged' | 'check_completed' | 'action_completed' | 'error_occurred';
    title: string;
    description: string;
    timestamp: string;
    repositoryId: string;
    pullRequestId?: number;
    checkId?: string;
    actionId?: string;
  }>;
  performanceMetrics: {
    checksPerDay: Array<{ date: string; passed: number; failed: number }>;
    actionsPerDay: Array<{ date: string; completed: number; failed: number }>;
    averageResponseTime: Array<{ date: string; time: number }>;
    repositoryActivity: Array<{ repositoryId: string; name: string; activity: number }>;
  };
}

export interface QueuedTask {
  id: string;
  type: 'review' | 'fix' | 'optimize' | 'test' | 'deploy' | 'monitor';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  title: string;
  description: string;
  repositoryId: string;
  pullRequestId?: number;
  estimatedDuration: number;
  actualDuration?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  progress: number;
  dependencies: string[];
  metadata: Record<string, any>;
  logs: Array<{
    timestamp: string;
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    data?: any;
  }>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: Record<string, any>;
}