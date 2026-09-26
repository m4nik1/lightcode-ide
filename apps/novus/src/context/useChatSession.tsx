/*
  Manages the chat sessions for the selected thread
  Also passes thinking traces to the chatView/messages
*/

export function useChatSession() {
  function sendQuery(value: string, mode: "build" | "plan") {
    const text = value.trim();
    if (!text || !currentThread) return;

    const threadID = currentThread.id;
    await loadThreadMessages(threadID);

    const userMessageID = crypto.randomUUID();
    const assistantMessageID = crypto.randomUUID();

    console.log(
      `Sending message to ${model.model} with ${model.thinking} thinking in the ${mode} mode `,
    );

    setMessagesByThread((current) => ({
      ...current,
      [threadID]: [
        ...(current[threadID] ?? []),
        {
          id: userMessageID,
          text,
          role: "user",
        },
        {
          id: assistantMessageID,
          text: "",
          role: "assistant",
        },
      ],
    }));

    const streamChat = await trpcClient.queryAI.query({
      threadID,
      message: text,
      model: model,
      mode,
      access,
    });

    setTurn(true);

    for await (const chunk of streamChat) {
      if (chunk.method == "item/agentMessage/delta") {
        const responseText = chunk.params.delta;

        setMessagesByThread((current) => ({
          ...current,
          [threadID]: (current[threadID] ?? []).map((message) =>
            message.id === assistantMessageID
              ? {
                  ...message,
                  text: message.text + responseText,
                }
              : message,
          ),
        }));
      }

      if (chunk.method === "turn/completed") {
        setTurn(false);
      } else {
        setTurn(true);
      }
    }

    const threadTitle = await trpcClient.getThreadTitle.mutate({
      threadID,
    });

    setThread((current) => {
      return current?.id === threadID
        ? { ...current, title: threadTitle }
        : current;
    });

    // Lets the thread/project list know its out of date
    await queryClient.invalidateQueries({
      queryKey: ["threads", currentThread.projectId],
    });     
  }

  return { sendQuery }
}