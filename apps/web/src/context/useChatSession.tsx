/*
  Manages the chat sessions for the selected thread
  Also passes thinking traces to the chatView/messages
*/


import { useAIChat } from "./useAIChat";
import { trpcClient } from "@/utils/trpc";
import { useThreads } from "./useThreads";
import { queryClient } from '../utils/trpc'
import { noThreadAtom, threadAtom } from "@/lib/threadAtoms";
import { useAtomValue, useStore } from "jotai";

export function useChatSession() {
  
  const store = useStore();
  const { model, access, setTurn } = useAIChat();
  const { currentThread, setThread } = useThreads();

  const threadID = currentThread?.id;
  const { messages, thinking } = useAtomValue(
    threadID ? threadAtom(threadID) : noThreadAtom,
  );

  async function sendQuery(value: string, mode: "build" | "plan") {
    const text = value.trim();
    if (!text || !currentThread) return;

    const threadID = currentThread.id;

    const userMessageID = crypto.randomUUID();
    const assistantMessageID = crypto.randomUUID();

    store.set(threadAtom(threadID), (s) => {
      return { ...s, messages: [...s.messages, { id: userMessageID, text, role: 'user' }, { id: assistantMessageID, text: '', role: 'assistant' }] }
    });

    setTurn(true);

    try {
      const streamChat = await trpcClient.queryAI.query({
        threadID,
        message: text,
        model: model,
        mode,
        access,
      });

      let markedRunning = false;

      for await (const chunk of streamChat) {
        // The server has marked the thread running by the first event
        if (!markedRunning) {
          markedRunning = true;
          void queryClient.invalidateQueries({ queryKey: ["threads"] });
        }

        if (chunk.method == "item/agentMessage/delta") {
          const responseText = chunk.params.delta;

          store.set(threadAtom(threadID), (s) => {
            return {
              ...s,
              thinking: false,
              messages: s.messages.map((m) =>
                m.id == assistantMessageID ? { ...m, text: m.text + responseText } : m,
              ),
            };
          });
        } else if(chunk.method != "turn/completed"){
          store.set(threadAtom(threadID), (s) => {
            return {
              ...s,
              thinking: true,
            };
          });
        }
      }
    } finally {
      // Turn is over, whether or not the agent sent any text
      store.set(threadAtom(threadID), (s) => ({ ...s, thinking: false }));
      setTurn(false);
      void queryClient.invalidateQueries({ queryKey: ["threads"] });
    }

    try {
      // Get the new thread title
      const title = await trpcClient.getThreadTitle.mutate({
        threadID,
      });

      // Only update the title if one was generated and the user is still on this thread
      if (title) {
        setThread((current) =>
          current?.id == threadID && current.title != title ? { ...current, title } : current,
        );
      }
    } finally {
      // Lets the thread list know its out of date, even if titling failed
      await queryClient.invalidateQueries({
        queryKey: ["threads"],
      });
    }
  }

  return { sendQuery, messages, thinking };
}
