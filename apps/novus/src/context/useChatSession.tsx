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
  const { model, access } = useAIChat();
  const { currentThread } = useThreads();

  const threadID = currentThread?.id;
  const { messages, isStreaming } = useAtomValue(
    threadID ? threadAtom(threadID) : noThreadAtom,
  );

  async function sendQuery(value: string, mode: "build" | "plan") {
    const text = value.trim();
    if (!text || !currentThread) return;

    const threadID = currentThread.id;

    const userMessageID = crypto.randomUUID();
    const assistantMessageID = crypto.randomUUID();

    console.log(
      `Sending message to ${model.model} with ${model.thinking} thinking in the ${mode} mode `,
    );

    store.set(threadAtom(threadID), (s) => {
      console.log(s)
      return { ...s, messages: [...s.messages, { id: userMessageID, text, role: 'user' }, { id: assistantMessageID, text: '', role: 'assistant' }] }
    });

    const streamChat = await trpcClient.queryAI.query({
      threadID,
      message: text,
      model: model,
      mode,
      access,
    });

    for await (const chunk of streamChat) {
      if (chunk.method == "item/agentMessage/delta") {
        const responseText = chunk.params.delta;

        store.set(threadAtom(threadID), (s) => {
          return {
            ...s,
            isStreaming: true,
            messages: s.messages.map((m) =>
              m.id == assistantMessageID ? { ...m, text: m.text + responseText } : m,
            ),
          };
        });
      }

      // if (chunk.method === "turn/completed") {
      //   setTurn(false);
      // } else {
      //   setTurn(true);
      // }
    }

    // Get the new thread title
    const threadTitle = await trpcClient.getThreadTitle.mutate({
      threadID,
    });

    // Old: Set the thread title
    // setThread((current) => {
    //   return current?.id === threadID
    //     ? { ...current, title: threadTitle }
    //     : current;
    // });

    // Lets the thread/project list know its out of date
    await queryClient.invalidateQueries({
      queryKey: ["threads", currentThread.projectId],
    });     
  }

  return { sendQuery, messages }
}
