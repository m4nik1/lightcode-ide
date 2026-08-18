import { createContext, useState, useContext, type ReactNode } from "react";
import { trpcClient } from "../utils/trpc";
import { useQuery } from "@tanstack/react-query";
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
  createProject: () => void;
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
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [currentThread, setThread] = useState<thread | null>(null);
  const [isTurning, setTurn] = useState<boolean>(false);

  const [model, setModel] = useState<AIModel>({
    model: "gpt-5.6-terra",
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

  async function messageSend(value: string, mode: "build" | "plan") {
    const text = value.trim();
    if (!text || !currentThread) return;

    const threadID = currentThread.id;
    await loadThreadMessages(threadID);

    const userMessageID = crypto.randomUUID();
    const assistantMessageID = crypto.randomUUID();

    console.log(
      `Sending message to ${model.model} with ${model.thinking} thinking in the ${mode} mode `,
    );

    setMessagesByThread((current) => ({
      ...current,
      [threadID]: [
        ...(current[threadID] ?? []),
        {
          id: userMessageID,
          text,
          role: "user",
        },
        {
          id: assistantMessageID,
          text: "",
          role: "assistant",
        },
      ],
    }));

    const access = mode === "plan" ? "read-only" : "workspace-write";

    const streamChat = await trpcClient.queryAI.query({
      threadID,
      message: text,
      model: model,
      mode,
      access,
    });

    setTurn(true);

    for await (const chunk of streamChat) {
      if (chunk.method == "item/agentMessage/delta") {
        const responseText = chunk.params.delta;

        setMessagesByThread((current) => ({
          ...current,
          [threadID]: (current[threadID] ?? []).map((message) =>
            message.id === assistantMessageID
              ? {
                  ...message,
                  text: message.text + responseText,
                }
              : message,
          ),
        }));
      }

      if (chunk.method === "turn/completed") {
        console.log("Turn completed");
        setTurn(false);
      } else {
        setTurn(true);
      }
    }

    const threadTitle = await trpcClient.getThreadTitle.mutate({
      threadID,
    });

    setThread((current) => {
      return current?.id === threadID
        ? { ...current, title: threadTitle }
        : current;
    });

    await projectsQuery.refetch();
  }

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

  async function createProject() {
    const projectFolder = await window.electronAPI.openFolder();
    const projectFolderPath = projectFolder.filePaths[0];

    if (!projectFolderPath) {
      return;
    }

    const folderName = projectFolderPath.split("/")?.at(-1);

    if (!folderName) {
      return;
    }

    await trpcClient.addProject.mutate({
      projectName: folderName,
      path: projectFolderPath,
    });

    await projectsQuery.refetch();
  }

  function modelSet(model: AIModelId, thinking: AIReasoningEffort) {
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
        createProject,
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
