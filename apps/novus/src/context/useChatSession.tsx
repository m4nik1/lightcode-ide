/*
  Manages the chat sessions for the selected thread
  Also passes thinking traces to the chatView/messages
*/

import { useAIChat } from "./useAIChat";
import { trpcClient } from "@/utils/trpc";
import { useThreads } from "./useThreads";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from '../utils/trpc'

export function useChatSession() {
  const { model, access } = useAIChat();
  const { currentThread, setThread } = useThreads()

  const { data: messages = [] } = useQuery({
    queryKey: [currentThread],
    queryFn: () => trpcClient.loadMessages.query({ currentThread.id })
  });

  async function sendQuery(value: string, mode: "build" | "plan") {
    const text = value.trim();
    if (!text || !currentThread) return;

    const threadID = currentThread.id;

    const userMessageID = crypto.randomUUID();
    const assistantMessageID = crypto.randomUUID();

    console.log(
      `Sending message to ${model.model} with ${model.thinking} thinking in the ${mode} mode `,
    );

    // TODO: Remove this
    // setMessagesByThread((current) => ({
    //   ...current,
    //   [threadID]: [
    //     ...(current[threadID] ?? []),
    //     {
    //       id: userMessageID,
    //       text,
    //       role: "user",
    //     },
    //     {
    //       id: assistantMessageID,
    //       text: "",
    //       role: "assistant",
    //     },
    //   ],
    // }));

    const streamChat = await trpcClient.queryAI.query({
      threadID,
      message: text,
      model: model,
      mode,
      access,
    });

    // setTurn(true);

    for await (const chunk of streamChat) {
      if (chunk.method == "item/agentMessage/delta") {
        const responseText = chunk.params.delta;

        // setMessagesByThread((current) => ({
        //   ...current,
        //   [threadID]: (current[threadID] ?? []).map((message) =>
        //     message.id === assistantMessageID
        //       ? {
        //           ...message,
        //           text: message.text + responseText,
        //         }
        //       : message,
        //   ),
        // }));
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