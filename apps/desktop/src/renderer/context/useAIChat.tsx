import { createContext, useState, useContext, type ReactNode } from "react";
import { trpcClient, trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import type { ChatMessage } from "@/components/AIWindow/ChatMessages";
import type { thread } from "@/components/AIWindow/sidebar/types";

type AIContext = {
  messages: ChatMessage[];
  messageSend: (value: string) => Promise<void>;
  modelSet: (model: string, thinking: string) => void;
  createProject: () => void;
  currentThread: thread | null;
  setCurrentThread: (thread: thread) => void;
  isTurning: boolean;
  stopTurn: (thread_id: string) => void;
};

type AIModel = {
  model: string;
  thinking: string;
};

const aiContext = createContext<AIContext | undefined>(undefined);

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [messagesByThread, setMessagesByThread] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [currentThread, setThread] = useState<thread | null>(null);
  const [isTurning, setTurn] = useState<boolean>(false);

  const [model, setModel] = useState<AIModel>({
    model: "gpt-5.5",
    thinking: "low",
  });
  const projectsQuery = useQuery(trpc.getProjects.queryOptions());
  const messages = currentThread
    ? (messagesByThread[currentThread.id] ?? [])
    : [];

  async function messageSend(value: string) {
    const text = value.trim();
    if (!text || !currentThread) return;

    const threadID = currentThread.id;
    await loadThreadMessages(threadID);

    const userMessageID = crypto.randomUUID();
    const assistantMessageID = crypto.randomUUID();

    console.log(
      `Sending message to ${model.model} with ${model.thinking} thinking`,
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

    const streamChat = await trpcClient.queryAI.query({
      threadID,
      message: text,
      model: model,
    });

    for await (const chunk of streamChat) {
      if (
        chunk.method == "item/agentMessage/delta"
      ) {
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

      if(chunk.method === "turn/completed") {
        console.log("Turn completed");
        setTurn(false);
      }
      setTurn(true);
    }

    const threadTitle = await trpcClient.getThreadTitle.mutate({
      threadID
    });

    setThread((current) => {
      return current?.id === threadID ? { ...current, title: threadTitle } : current;
    });

    await projectsQuery.refetch();
  }

  function stopTurn() {
    if (!currentThread) return;

    console.log("Stopping the current turn");

    trpcClient.stopTurn.query({ threadID: currentThread.id }).then(() => {
      setTurn(false);
    }).catch((error) => {
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

  function modelSet(model: string, thinking: string) {
    setModel({ model, thinking });
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
    throw new Error("useEditorTabs must be used within an aiChatProvider!");
  }

  return context;
}
