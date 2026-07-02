import { createContext, ReactNode, useState, useContext } from "react";
import { trpcClient } from "@/utils/trpc";
import { ChatMessage } from "@/components/AIWindow/ChatBubbles";

type AIContext = {
  messages: ChatMessage[];
  messageSend: (value: string) => Promise<void>;
  modelSet: (model: string, thinking: string) => void;
};

type AIModel = {
  model: string;
  thinking: string;
};

const aiContext = createContext<AIContext | undefined>(undefined);

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [model, setModel] = useState<AIModel>({
    model: "gpt-5.5",
    thinking: "low",
  });

  async function messageSend(value: string) {
    const text = value.trim();
    if (!text) return;

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
      message: text,
      model: model,
      path: "/Users/maniksoomro/Documents/t3code",
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

  function modelSet(model: string, thinking: string) {
    setModel({ model, thinking });
  }

  return (
    <aiContext.Provider
      value={{
        messages,
        messageSend,
        modelSet,
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
