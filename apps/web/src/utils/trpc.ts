import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';
import type { AIModelId, AIReasoningEffort } from '../lib/aiModelConfig';

export type ProjectRow = {
  id: string;
  name: string;
  path: string;
};

export type ThreadListRow = {
  id: string;
  project_id: string;
  name: string;
  created_at: number;
  project_name: string;
  project_path: string;
  model: string | null;
  running: boolean;
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

export type DirectoryListing = {
  path: string;
  parent: string | null;
  directories: { name: string; path: string }[];
};

type AIEvent =
  | { method: "item/agentMessage/delta"; params: { delta: string } }
  | { method: "turn/completed" };

type Router = {
  getProjects: { query: () => Promise<ProjectRow[]> };
  getAllThreads: { query: () => Promise<ThreadListRow[]> };
  listDirectories: {
    query: (input: { path?: string | null }) => Promise<DirectoryListing>;
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
  links: [httpBatchStreamLink({
    url: import.meta.env.VITE_API_URL || (window.electronAPI ? 'http://localhost:2024' : '/trpc'),
  })],
}) as unknown as Router;
