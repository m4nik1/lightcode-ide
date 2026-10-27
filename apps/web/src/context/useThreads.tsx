import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { thread } from "../components/sidebar/types";
import { trpcClient } from "../utils/trpc";

interface ThreadContext {
  currentThread: thread | null;
  newThread: (projectId: string, projectPath: string) => Promise<thread>;
  setThread: Dispatch<SetStateAction<thread | null>>;
  deleteThread: (threadId: string) => Promise<void>;
}

const threadContext = createContext<ThreadContext | undefined>(undefined);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [currentThread, setThread] = useState<thread | null>(null);
  const queryClient = useQueryClient();

  async function newThread(projectId: string, projectPath: string) {
    const result = await trpcClient.addThread.mutate({
      threadName: "Untitled chat",
      projectId,
    });

    const createdThread: thread = {
      id: result.id,
      title: result.name,
      projectId,
      projectPath,
    };

    await queryClient.invalidateQueries({
      queryKey: ["threads"],
    });
    setThread(createdThread);
    return createdThread;
  }

  async function deleteThread(threadId: string) {
    await trpcClient.deleteThread.mutate({ threadID: threadId });

    // Leave the chat view if the open thread was the one removed
    setThread((current) => (current?.id === threadId ? null : current));
    await queryClient.invalidateQueries({
      queryKey: ["threads"],
    });
  }

  return (
    <threadContext.Provider
      value={{
        currentThread,
        setThread,
        newThread,
        deleteThread,
      }}
    >
      {children}
    </threadContext.Provider>
  )
};

export function useThreads() {
  const context  = useContext(threadContext);

  if(!context) {
    throw new Error('useThreads must be used within its provider')
  }

  return context
}