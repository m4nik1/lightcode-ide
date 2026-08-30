import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';
import type { AIModelId, AIReasoningEffort } from '../lib/aiModelConfig';

export type ProjectRow = {
  id: string;
  name: string;
  path: string;
};

export type ThreadRow = {
  id: string;
  project_id: string;
  name: string;
};

export type MessageRow = {
  id: string;
  text: string;
  role: "user" | "assistant";
};

export type FileSearchResult = {
  relativePath: string;
  fileName: string;
};

type AIEvent =
  | { method: "item/agentMessage/delta"; params: { delta: string } }
  | { method: "turn/completed" };

type Router = {
  getProjects: { query: () => Promise<ProjectRow[]> };
  getThreads: {
    query: (input: { projectID: string }) => Promise<ThreadRow[]>;
  };
  addProject: {
    mutate: (input: { projectName: string; path: string }) => Promise<unknown>;
  };
  addThread: {
    mutate: (input: {
      threadName: string;
      projectId: string;
    }) => Promise<{ id: string; name: string }>;
  };
  deleteThread: { mutate: (input: { threadID: string }) => Promise<unknown> };
  loadMessages: {
    query: (input: { threadID: string }) => Promise<MessageRow[]>;
  };
  queryAI: {
    query: (input: {
      threadID: string;
      message: string;
      model: { model: AIModelId; thinking: AIReasoningEffort };
      mode: "build" | "plan";
      access: "read-only" | "workspace-write" | "danger-full-access";
    }) => Promise<AsyncGenerator<AIEvent>>;
  };
  getThreadTitle: {
    mutate: (input: { threadID: string }) => Promise<string>;
  };
  stopTurn: { query: (input: { threadID: string }) => Promise<unknown> };
  fileSearch: {
    query: (input: {
      projectPath: string;
      searchQuery: string;
    }) => Promise<FileSearchResult[]>;
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export const trpcClient = createTRPCClient({
  links: [httpBatchStreamLink({ url: 'http://localhost:2024' })],
}) as unknown as Router;
