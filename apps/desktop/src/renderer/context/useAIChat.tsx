import {
  createContext,
  ReactNode,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import { trpcClient, trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { ChatMessage } from "@/components/AIWindow/ChatBubbles";
import type { thread } from "@/components/AIWindow/sidebar/types";

type AIContext = {
  messages: ChatMessage[];
  messageSend: (value: string) => Promise<void>;
  modelSet: (model: string, thinking: string) => void;
  createProject: () => void;
  currentThread: thread | null;
  setCurrentThread: Dispatch<SetStateAction<thread | null>>;
};

type AIModel = {
  model: string;
  thinking: string;
};

const aiContext = createContext<AIContext | undefined>(undefined);

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentThread, setCurrentThread] = useState<thread | null>(null);
  const [model, setModel] = useState<AIModel>({
    model: "gpt-5.5",
    thinking: "low",
  });
  const projectsQuery = useQuery(trpc.getProjects.queryOptions());

  async function messageSend(value: string) {
    const text = value.trim();
    if (!text || !currentThread) return;

    const id = crypto.randomUUID();

    setMessages((current) => [
      ...current,
      {
        id,
        query: text,
        aiResponse: "",
      },
    ]);

    const streamChat = await trpcClient.queryAI.query({
      threadID: currentThread.id,
      message: text,
      model: model,
    });

    for await (const chunk of streamChat) {
      console.log("Chunk: ", chunk);
      if (chunk.type == "item.completed") {
        setMessages((current) =>
          current.map((message) =>
            message.id === id
              ? { ...message, aiResponse: message.aiResponse + chunk.item.text }
              : message,
          ),
        );
      }
    }
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
