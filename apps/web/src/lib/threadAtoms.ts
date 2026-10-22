import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import type { ChatMessage } from '@/components/ChatView';
import { trpcClient } from '@/utils/trpc';

export type ThreadState = {
    messages: ChatMessage[];
    thinking: boolean;
}

const initialThreadState: ThreadState = { messages: [], thinking: false }

// Every Thread will start with this
export const threadAtom = atomFamily((threadID : string) => {
  // atom is type threadState with the following fields as default 
  const threadState = atom<ThreadState>(initialThreadState)

  threadState.onMount = (set) => {
    trpcClient.loadMessages.query({ threadID }).then((savedMessages) => {
      set((s) => ({ ...s, messages: savedMessages }))
    })
  }

  return threadState;
});

// Read-only fallback when no thread is selected
export const noThreadAtom = atom(() => initialThreadState)