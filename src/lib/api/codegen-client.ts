import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  CodegenConfiguration,
  Repository,
  PullRequest,
  CheckResult,
  AgentAction,
  AgentConfiguration,
  DashboardStats,
  QueuedTask,
  ApiError,
  ApiResponse,
} from '../types/codegen';

export class CodegenApiClient {
  private client: AxiosInstance;
  private config: CodegenConfiguration;

  constructor(config: CodegenConfiguration) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[Codegen API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred',
          timestamp: new Date().toISOString(),
          requestId: error.response?.headers['x-request-id'],
        };

        if (error.response?.data) {
          apiError.details = error.response.data as Record<string, any>;
        }

        console.error('[Codegen API Error]', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  // Repository Management
  async getRepositories(page = 1, perPage = 50): Promise<ApiResponse<Repository[]>> {
    try {
      const response = await this.client.get('/repositories', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async getRepository(repositoryId: string): Promise<ApiResponse<Repository>> {
    try {
      const response = await this.client.get(`/repositories/${repositoryId}`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async createRepository(repository: Partial<Repository>): Promise<ApiResponse<Repository>> {
    try {
      const response = await this.client.post('/repositories', repository);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async updateRepository(repositoryId: string, updates: Partial<Repository>): Promise<ApiResponse<Repository>> {
    try {
      const response = await this.client.patch(`/repositories/${repositoryId}`, updates);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async deleteRepository(repositoryId: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(`/repositories/${repositoryId}`);
      return {};
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  // Pull Request Management
  async getPullRequests(repositoryId: string, state?: 'open' | 'closed' | 'all'): Promise<ApiResponse<PullRequest[]>> {
    try {
      const response = await this.client.get(`/repositories/${repositoryId}/pulls`, {
        params: { state: state || 'open' }
      });
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async getPullRequest(repositoryId: string, pullNumber: number): Promise<ApiResponse<PullRequest>> {
    try {
      const response = await this.client.get(`/repositories/${repositoryId}/pulls/${pullNumber}`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async createPullRequest(repositoryId: string, pullRequest: Partial<PullRequest>): Promise<ApiResponse<PullRequest>> {
    try {
      const response = await this.client.post(`/repositories/${repositoryId}/pulls`, pullRequest);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async updatePullRequest(repositoryId: string, pullNumber: number, updates: Partial<PullRequest>): Promise<ApiResponse<PullRequest>> {
    try {
      const response = await this.client.patch(`/repositories/${repositoryId}/pulls/${pullNumber}`, updates);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async mergePullRequest(repositoryId: string, pullNumber: number, mergeMethod: 'merge' | 'squash' | 'rebase' = 'merge'): Promise<ApiResponse<PullRequest>> {
    try {
      const response = await this.client.put(`/repositories/${repositoryId}/pulls/${pullNumber}/merge`, {
        merge_method: mergeMethod
      });
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  // Checks Management
  async getChecks(repositoryId: string, ref?: string): Promise<ApiResponse<CheckResult[]>> {
    try {
      const response = await this.client.get(`/repositories/${repositoryId}/checks`, {
        params: { ref }
      });
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async getCheck(repositoryId: string, checkId: string): Promise<ApiResponse<CheckResult>> {
    try {
      const response = await this.client.get(`/repositories/${repositoryId}/checks/${checkId}`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async createCheck(repositoryId: string, check: Partial<CheckResult>): Promise<ApiResponse<CheckResult>> {
    try {
      const response = await this.client.post(`/repositories/${repositoryId}/checks`, check);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async updateCheck(repositoryId: string, checkId: string, updates: Partial<CheckResult>): Promise<ApiResponse<CheckResult>> {
    try {
      const response = await this.client.patch(`/repositories/${repositoryId}/checks/${checkId}`, updates);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async triggerChecks(repositoryId: string, ref: string): Promise<ApiResponse<CheckResult[]>> {
    try {
      const response = await this.client.post(`/repositories/${repositoryId}/checks/trigger`, { ref });
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  // Agent Actions
  async getActions(repositoryId?: string, status?: string): Promise<ApiResponse<AgentAction[]>> {
    try {
      const params: Record<string, any> = {};
      if (repositoryId) params.repository_id = repositoryId;
      if (status) params.status = status;

      const response = await this.client.get('/actions', { params });
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async getAction(actionId: string): Promise<ApiResponse<AgentAction>> {
    try {
      const response = await this.client.get(`/actions/${actionId}`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async createAction(action: Partial<AgentAction>): Promise<ApiResponse<AgentAction>> {
    try {
      const response = await this.client.post('/actions', action);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async cancelAction(actionId: string): Promise<ApiResponse<AgentAction>> {
    try {
      const response = await this.client.post(`/actions/${actionId}/cancel`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async retryAction(actionId: string): Promise<ApiResponse<AgentAction>> {
    try {
      const response = await this.client.post(`/actions/${actionId}/retry`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  // Agent Configuration
  async getAgentConfig(repositoryId: string): Promise<ApiResponse<AgentConfiguration>> {
    try {
      const response = await this.client.get(`/repositories/${repositoryId}/agent/config`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async updateAgentConfig(repositoryId: string, config: Partial<AgentConfiguration>): Promise<ApiResponse<AgentConfiguration>> {
    try {
      const response = await this.client.patch(`/repositories/${repositoryId}/agent/config`, config);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async enableAgent(repositoryId: string): Promise<ApiResponse<void>> {
    try {
      await this.client.post(`/repositories/${repositoryId}/agent/enable`);
      return {};
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async disableAgent(repositoryId: string): Promise<ApiResponse<void>> {
    try {
      await this.client.post(`/repositories/${repositoryId}/agent/disable`);
      return {};
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  // Dashboard & Analytics
  async getDashboardStats(repositoryId?: string, dateRange?: { from: string; to: string }): Promise<ApiResponse<DashboardStats>> {
    try {
      const params: Record<string, any> = {};
      if (repositoryId) params.repository_id = repositoryId;
      if (dateRange) {
        params.from = dateRange.from;
        params.to = dateRange.to;
      }

      const response = await this.client.get('/dashboard/stats', { params });
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async getSystemHealth(): Promise<ApiResponse<{ status: string; checks: Record<string, any> }>> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  // Queue Management
  async getQueue(): Promise<ApiResponse<QueuedTask[]>> {
    try {
      const response = await this.client.get('/queue');
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async getQueuedTask(taskId: string): Promise<ApiResponse<QueuedTask>> {
    try {
      const response = await this.client.get(`/queue/${taskId}`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async addToQueue(task: Partial<QueuedTask>): Promise<ApiResponse<QueuedTask>> {
    try {
      const response = await this.client.post('/queue', task);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async cancelQueuedTask(taskId: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(`/queue/${taskId}`);
      return {};
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async pauseQueue(): Promise<ApiResponse<void>> {
    try {
      await this.client.post('/queue/pause');
      return {};
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async resumeQueue(): Promise<ApiResponse<void>> {
    try {
      await this.client.post('/queue/resume');
      return {};
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async clearQueue(): Promise<ApiResponse<void>> {
    try {
      await this.client.post('/queue/clear');
      return {};
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  // Webhooks
  async getWebhooks(repositoryId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.client.get(`/repositories/${repositoryId}/webhooks`);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async createWebhook(repositoryId: string, webhook: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post(`/repositories/${repositoryId}/webhooks`, webhook);
      return response.data;
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  async deleteWebhook(repositoryId: string, webhookId: string): Promise<ApiResponse<void>> {
    try {
      await this.client.delete(`/repositories/${repositoryId}/webhooks/${webhookId}`);
      return {};
    } catch (error) {
      return { error: error as ApiError };
    }
  }

  // Configuration helpers
  updateConfig(newConfig: Partial<CodegenConfiguration>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.apiKey) {
      this.client.defaults.headers['Authorization'] = `Bearer ${newConfig.apiKey}`;
    }

    if (newConfig.baseUrl) {
      this.client.defaults.baseURL = newConfig.baseUrl;
    }
  }

  getConfig(): CodegenConfiguration {
    return { ...this.config };
  }
}

// Singleton instance
let apiClient: CodegenApiClient | null = null;

export function createCodegenClient(config: CodegenConfiguration): CodegenApiClient {
  apiClient = new CodegenApiClient(config);
  return apiClient;
}

export function getCodegenClient(): CodegenApiClient {
  if (!apiClient) {
    throw new Error('Codegen API client not initialized. Call createCodegenClient first.');
  }
  return apiClient;
}

export default CodegenApiClient;