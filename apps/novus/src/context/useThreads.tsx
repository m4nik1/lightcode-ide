/*
    Context for the current thread
*/

import { createContext, ReactNode, useContext, useState } from "react"
import type { thread } from "../components/sidebar/types";

interface context {
  currentThread: thread | null;
  newThread: (projectId: string) => void;
  setThread: (thread: thread) => void;
}

const threadContext = createContext<context | undefined>(undefined)

export function threadProvider({ children }: { children: ReactNode }) {
  const [currentThread, setThread] = useState< thread | null>(null);

  function newThread(projectId : string) {

  }

  return (
    <threadContext.Provider
      value={{
        currentThread,
        setThread,
        newThread,
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