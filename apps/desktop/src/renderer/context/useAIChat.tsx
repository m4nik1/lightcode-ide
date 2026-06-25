import { createContext, ReactNode, useState, useContext } from "react";
import { trpcClient } from "@/utils/trpc";

type AIContext = {
  message: string;
  messageSend: (value: string) => Promise<void>;
};

const aiContext = createContext<AIContext | undefined>(undefined);

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");

  async function messageSend(value: string) {
    // const messageSent = value.trim();
    // if (!message) return;

    setMessage(value);

    const streamChat = await trpcClient.queryAI.query({ message: value });

    for await (const chunk of streamChat) {
      console.log("Chunk: ", chunk);
    }
  }

  return (
    <aiContext.Provider
      value={{
        message,
        messageSend,
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
