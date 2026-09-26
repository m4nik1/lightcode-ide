import { createContext, useState, useContext, type ReactNode } from "react";
import { trpcClient } from "../utils/trpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage } from "../components/ChatMessages";
import type { thread } from "../components/sidebar/types";
import type { AIModelId, AIReasoningEffort } from "../lib/aiModelConfig";

type AccessMode = "read-only" | "workspace-write" | "danger-full-access";

type AIContext = {
  messages: ChatMessage[];
  messageSend: (value: string, mode: "build" | "plan") => Promise<void>;
  modelSet: (model: AIModelId, thinking: AIReasoningEffort) => void;
  access: AccessMode;
  accessSet: (access: AccessMode) => void;
  currentThread: thread | null;
  setCurrentThread: (thread: thread) => void;
  isTurning: boolean;
  stopTurn: () => void;
};

type AIModel = {
  model: AIModelId;
  thinking: AIReasoningEffort;
};

const aiContext = createContext<AIContext | undefined>(undefined);

export function AiChatProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [currentThread, setThread] = useState<thread | null>(null);
  const [isTurning, setTurn] = useState<boolean>(false);

  const [model, setModel] = useState<AIModel>({
    model: "gpt-5.6-luna",
    thinking: "low",
  });
  const [access, setAccess] = useState<AccessMode>("workspace-write");
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => trpcClient.getProjects.query(),
  });
  const messages = currentThread
    ? (messagesByThread[currentThread.id] ?? [])
    : [];

  function stopTurn() {
    if (!currentThread) return;

    console.log("Stopping the current turn");

    trpcClient.stopTurn
      .query({ threadID: currentThread.id })
      .then(() => {
        setTurn(false);
      })
      .catch((error: unknown) => {
        console.error("Error something went wrong", error);
      });
  }

  function modelSet(model: AIModelId, thinking: AIReasoningEffort) {
    console.log("Picked: ", model, " with thinking: ", thinking);
    setModel({ model, thinking });
  }

  function accessSet(access: AccessMode) {
    setAccess(access);
  }

  async function loadThreadMessages(threadID: string) {
    const messages = await trpcClient.loadMessages.query({ threadID });

    return messages;
  }

  async function setCurrentThread(thread: thread) {
    if (thread.id === currentThread?.id) return;

    setThread(thread);
    const threadMessages = await loadThreadMessages(thread.id);

    setMessagesByThread((current) => ({
      ...current,
      [thread.id]: threadMessages,
    }));
  }

  return (
    <aiContext.Provider
      value={{
        messages,
        messageSend,
        modelSet,
        access,
        accessSet,
        currentThread,
        setCurrentThread,
        isTurning,
        stopTurn,
      }}
    >
      {children}
    </aiContext.Provider>
  );
}

export function useAIChat() {
  const context = useContext(aiContext);

  if (!context) {
    throw new Error("useAIChat must be used within an AiChatProvider!");
  }

  return context;
}
