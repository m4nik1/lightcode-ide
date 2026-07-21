import {
  createContext,
  useState,
  useContext,
  useRef,
  type ReactNode,
} from "react";
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
  // Reuse thread loads so revisiting a thread cannot overwrite a response in progress.
  const loadedThreadIDs = useRef(new Set<string>());
  const threadLoadPromises = useRef(new Map<string, Promise<void>>());
  const titleGenerationAttemptedThreadIDs = useRef(new Set<string>());
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

    const shouldGenerateTitle =
      !titleGenerationAttemptedThreadIDs.current.has(threadID);
    if (shouldGenerateTitle) {
      // Reserve the first-message title generation before awaiting the response so
      // rapid sends cannot schedule a second rename for the same thread.
      titleGenerationAttemptedThreadIDs.current.add(threadID);
    }

    const userMessageID = crypto.randomUUID();
    const assistantMessageID = crypto.randomUUID();

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
        chunk.type === "item.completed" &&
        chunk.item.type === "agent_message"
      ) {
        const responseText = chunk.item.text;

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
    }

    const threadTitle = await trpcClient.generateThreadMessage.mutate({
      id: threadID,
      message: text,
    });

    if (
      !threadTitle ||
      typeof threadTitle.id !== "string" ||
      typeof threadTitle.name !== "string"
    ) {
      console.error("Generated thread title has an invalid response:", threadTitle);
      return;
    }

    const titleThreadID = threadTitle.id;
    const title = threadTitle.name;

    setThread((current) =>
      current?.id === titleThreadID
        ? { ...current, title }
        : current,
    );

    
    await projectsQuery.refetch()
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

    console.log("Project path: ", projectFolderPath);

    await projectsQuery.refetch();

    console.log("Project folder found: ", projectFolderPath);
  }

  function modelSet(model: string, thinking: string) {
    setModel({ model, thinking });
  }

  function loadThreadMessages(threadID: string) {
    if (loadedThreadIDs.current.has(threadID)) {
      return Promise.resolve();
    }

    const existingLoad = threadLoadPromises.current.get(threadID);
    if (existingLoad) return existingLoad;

    const load = trpcClient.loadMessages
      .query({ threadID })
      .then((loadedMessages) => {
        if (loadedMessages.some((message) => message.role === "user")) {
          titleGenerationAttemptedThreadIDs.current.add(threadID);
        }
        setMessagesByThread((current) => ({
          ...current,
          [threadID]: loadedMessages,
        }));
        loadedThreadIDs.current.add(threadID);
      })
      .finally(() => {
        threadLoadPromises.current.delete(threadID);
      });

    threadLoadPromises.current.set(threadID, load);
    return load;
  }

  async function setCurrentThread(thread: thread) {
    if (thread.id === currentThread?.id) return;

    setThread(thread);
    await loadThreadMessages(thread.id);
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
