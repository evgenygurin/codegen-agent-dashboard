import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCodegenClient } from '../api/codegen-client';
import type {
  Repository,
  PullRequest,
  CheckResult,
  AgentAction,
  AgentConfiguration,
  DashboardStats,
  QueuedTask,
  ApiResponse,
} from '../types/codegen';

// Query Keys
export const queryKeys = {
  repositories: ['repositories'],
  repository: (id: string) => ['repository', id],
  pullRequests: (repositoryId: string, state?: string) => ['pullRequests', repositoryId, state],
  pullRequest: (repositoryId: string, pullNumber: number) => ['pullRequest', repositoryId, pullNumber],
  checks: (repositoryId: string, ref?: string) => ['checks', repositoryId, ref],
  check: (repositoryId: string, checkId: string) => ['check', repositoryId, checkId],
  actions: (repositoryId?: string, status?: string) => ['actions', repositoryId, status],
  action: (actionId: string) => ['action', actionId],
  agentConfig: (repositoryId: string) => ['agentConfig', repositoryId],
  dashboardStats: (repositoryId?: string, dateRange?: any) => ['dashboardStats', repositoryId, dateRange],
  systemHealth: ['systemHealth'],
  queue: ['queue'],
  queuedTask: (taskId: string) => ['queuedTask', taskId],
  webhooks: (repositoryId: string) => ['webhooks', repositoryId],
};

// Repository Hooks
export function useRepositories(page = 1, perPage = 50) {
  return useQuery({
    queryKey: [...queryKeys.repositories, page, perPage],
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getRepositories(page, perPage);
      if (response.error) throw response.error;
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRepository(repositoryId: string) {
  return useQuery({
    queryKey: queryKeys.repository(repositoryId),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getRepository(repositoryId);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!repositoryId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repository: Partial<Repository>) => {
      const client = getCodegenClient();
      const response = await client.createRepository(repository);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repositories });
    },
  });
}

export function useUpdateRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repositoryId, updates }: { repositoryId: string; updates: Partial<Repository> }) => {
      const client = getCodegenClient();
      const response = await client.updateRepository(repositoryId, updates);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repositories });
      queryClient.invalidateQueries({ queryKey: queryKeys.repository(variables.repositoryId) });
    },
  });
}

export function useDeleteRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (repositoryId: string) => {
      const client = getCodegenClient();
      const response = await client.deleteRepository(repositoryId);
      if (response.error) throw response.error;
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repositories });
    },
  });
}

// Pull Request Hooks
export function usePullRequests(repositoryId: string, state?: 'open' | 'closed' | 'all') {
  return useQuery({
    queryKey: queryKeys.pullRequests(repositoryId, state),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getPullRequests(repositoryId, state);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!repositoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePullRequest(repositoryId: string, pullNumber: number) {
  return useQuery({
    queryKey: queryKeys.pullRequest(repositoryId, pullNumber),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getPullRequest(repositoryId, pullNumber);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!repositoryId && !!pullNumber,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreatePullRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repositoryId, pullRequest }: { repositoryId: string; pullRequest: Partial<PullRequest> }) => {
      const client = getCodegenClient();
      const response = await client.createPullRequest(repositoryId, pullRequest);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pullRequests(variables.repositoryId) });
    },
  });
}

export function useMergePullRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      repositoryId,
      pullNumber,
      mergeMethod
    }: {
      repositoryId: string;
      pullNumber: number;
      mergeMethod?: 'merge' | 'squash' | 'rebase'
    }) => {
      const client = getCodegenClient();
      const response = await client.mergePullRequest(repositoryId, pullNumber, mergeMethod);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pullRequests(variables.repositoryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pullRequest(variables.repositoryId, variables.pullNumber) });
    },
  });
}

// Check Hooks
export function useChecks(repositoryId: string, ref?: string) {
  return useQuery({
    queryKey: queryKeys.checks(repositoryId, ref),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getChecks(repositoryId, ref);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!repositoryId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useCheck(repositoryId: string, checkId: string) {
  return useQuery({
    queryKey: queryKeys.check(repositoryId, checkId),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getCheck(repositoryId, checkId);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!repositoryId && !!checkId,
    staleTime: 30 * 1000,
  });
}

export function useTriggerChecks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repositoryId, ref }: { repositoryId: string; ref: string }) => {
      const client = getCodegenClient();
      const response = await client.triggerChecks(repositoryId, ref);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.checks(variables.repositoryId) });
    },
  });
}

// Action Hooks
export function useActions(repositoryId?: string, status?: string) {
  return useQuery({
    queryKey: queryKeys.actions(repositoryId, status),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getActions(repositoryId, status);
      if (response.error) throw response.error;
      return response.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

export function useAction(actionId: string) {
  return useQuery({
    queryKey: queryKeys.action(actionId),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getAction(actionId);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!actionId,
    staleTime: 30 * 1000,
  });
}

export function useCreateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: Partial<AgentAction>) => {
      const client = getCodegenClient();
      const response = await client.createAction(action);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actions() });
    },
  });
}

export function useCancelAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (actionId: string) => {
      const client = getCodegenClient();
      const response = await client.cancelAction(actionId);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data, actionId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.action(actionId) });
    },
  });
}

export function useRetryAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (actionId: string) => {
      const client = getCodegenClient();
      const response = await client.retryAction(actionId);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data, actionId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.action(actionId) });
    },
  });
}

// Agent Configuration Hooks
export function useAgentConfig(repositoryId: string) {
  return useQuery({
    queryKey: queryKeys.agentConfig(repositoryId),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getAgentConfig(repositoryId);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!repositoryId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAgentConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repositoryId, config }: { repositoryId: string; config: Partial<AgentConfiguration> }) => {
      const client = getCodegenClient();
      const response = await client.updateAgentConfig(repositoryId, config);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agentConfig(variables.repositoryId) });
    },
  });
}

export function useToggleAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repositoryId, enable }: { repositoryId: string; enable: boolean }) => {
      const client = getCodegenClient();
      const response = enable
        ? await client.enableAgent(repositoryId)
        : await client.disableAgent(repositoryId);
      if (response.error) throw response.error;
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agentConfig(variables.repositoryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.repository(variables.repositoryId) });
    },
  });
}

// Dashboard & Analytics Hooks
export function useDashboardStats(repositoryId?: string, dateRange?: { from: string; to: string }) {
  return useQuery({
    queryKey: queryKeys.dashboardStats(repositoryId, dateRange),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getDashboardStats(repositoryId, dateRange);
      if (response.error) throw response.error;
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: queryKeys.systemHealth,
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getSystemHealth();
      if (response.error) throw response.error;
      return response.data;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// Queue Management Hooks
export function useQueue() {
  return useQuery({
    queryKey: queryKeys.queue,
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getQueue();
      if (response.error) throw response.error;
      return response.data;
    },
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
  });
}

export function useQueuedTask(taskId: string) {
  return useQuery({
    queryKey: queryKeys.queuedTask(taskId),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getQueuedTask(taskId);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!taskId,
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
  });
}

export function useAddToQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Partial<QueuedTask>) => {
      const client = getCodegenClient();
      const response = await client.addToQueue(task);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queue });
    },
  });
}

export function useCancelQueuedTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const client = getCodegenClient();
      const response = await client.cancelQueuedTask(taskId);
      if (response.error) throw response.error;
      return response;
    },
    onSuccess: (data, taskId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queue });
      queryClient.invalidateQueries({ queryKey: queryKeys.queuedTask(taskId) });
    },
  });
}

export function useQueueControls() {
  const queryClient = useQueryClient();

  const pauseQueue = useMutation({
    mutationFn: async () => {
      const client = getCodegenClient();
      const response = await client.pauseQueue();
      if (response.error) throw response.error;
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queue });
    },
  });

  const resumeQueue = useMutation({
    mutationFn: async () => {
      const client = getCodegenClient();
      const response = await client.resumeQueue();
      if (response.error) throw response.error;
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queue });
    },
  });

  const clearQueue = useMutation({
    mutationFn: async () => {
      const client = getCodegenClient();
      const response = await client.clearQueue();
      if (response.error) throw response.error;
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queue });
    },
  });

  return { pauseQueue, resumeQueue, clearQueue };
}

// Webhook Hooks
export function useWebhooks(repositoryId: string) {
  return useQuery({
    queryKey: queryKeys.webhooks(repositoryId),
    queryFn: async () => {
      const client = getCodegenClient();
      const response = await client.getWebhooks(repositoryId);
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!repositoryId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repositoryId, webhook }: { repositoryId: string; webhook: any }) => {
      const client = getCodegenClient();
      const response = await client.createWebhook(repositoryId, webhook);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks(variables.repositoryId) });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repositoryId, webhookId }: { repositoryId: string; webhookId: string }) => {
      const client = getCodegenClient();
      const response = await client.deleteWebhook(repositoryId, webhookId);
      if (response.error) throw response.error;
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks(variables.repositoryId) });
    },
  });
}