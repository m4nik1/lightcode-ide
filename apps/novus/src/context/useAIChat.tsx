import { createContext, useState, useContext, type ReactNode } from "react";
import { trpcClient } from "../utils/trpc";
import type { AIModelId, AIReasoningEffort } from "../lib/aiModelConfig";
import { useThreads } from "./useThreads";

type AccessMode = "read-only" | "workspace-write" | "danger-full-access";

type AIContext = {
  model: AIModel;
  modelSet: (model: AIModelId, thinking: AIReasoningEffort) => void;
  access: AccessMode;
  accessSet: (access: AccessMode) => void;
  isTurning: boolean;
  stopTurn: () => void;
};

type AIModel = {
  model: AIModelId;
  thinking: AIReasoningEffort;
};

const aiContext = createContext<AIContext | undefined>(undefined);

export function AiChatProvider({ children }: { children: ReactNode }) {
  const { currentThread } = useThreads();
  const [isTurning, setTurn] = useState<boolean>(false);

  const [model, setModel] = useState<AIModel>({
    model: "gpt-5.6-luna",
    thinking: "low",
  });
  const [access, setAccess] = useState<AccessMode>("workspace-write");

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

  return (
    <aiContext.Provider
      value={{
        model,
        modelSet,
        access,
        accessSet,
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
