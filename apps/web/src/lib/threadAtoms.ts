import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import type { ChatMessage } from '@/components/ChatView';
import { trpcClient } from '@/utils/trpc';

export type ThreadState = {
    messages: ChatMessage[];
    thinking: boolean;
    model: string;
}

const initialThreadState: ThreadState = { messages: [], thinking: false, model: 'gpt-6.1-Sol' }

// Every Thread will start with this
// This is instiated when a existing thread is opened or created
// Local variables persist as long as the same threadID is looked up
export const threadAtom = atomFamily((threadID : string) => {
  // atom is type threadState with the following fields as default 
  const threadState = atom<ThreadState>(initialThreadState)

  let isLoaded = false;

  threadState.onMount = (set) => {
    if(isLoaded) return;
    isLoaded = true;
    try {
      trpcClient.loadMessages.query({ threadID }).then((savedMessages) => {
        // Don't clobber messages sent before the history finished loading
        set((s) => (s.messages.length > 0 ? s : { ...s, messages: savedMessages }))
      })
    } catch(e) {
      isLoaded = false;
      console.error("There was an error loading the thread")
    }
  }

  return threadState;
});

// Read-only fallback when no thread is selected
export const noThreadAtom = atom(() => initialThreadState)