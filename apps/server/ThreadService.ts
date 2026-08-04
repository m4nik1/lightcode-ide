import {
  Codex,
  type ModelReasoningEffort,
} from "@openai/codex-sdk";
import lightThread from "./lightThread.ts";
import {
  getProjectByThreadID,
  getThreadByID,
  loadMessagesFromThread,
  nextMessageSequence,
  storeMessage,
  renameThread,
  deleteThread,
} from "./lightQueries.ts";
import { CodexAppServerClient } from "@lightcode/codex-protocol";
import type { ServerNotification } from "@lightcode/codex-protocol";

type AIMessage = {
  threadID: string;
  projectID?: string;
  message: string;
  model: {
    model: string;
    thinking: string;
  };
};

export class ThreadService {
  recentThreads: lightThread[];
  threads: Map<string, lightThread>;
  codexInstance: CodexAppServerClient;
  constructor(AIDriver: CodexAppServerClient) {
    this.recentThreads = [];
    this.threads = new Map();
    this.codexInstance = AIDriver;

    this.codexInstance.connect();
  }0

  async stopTurn(threadID: string) {
    console.log("Interrupting turn")

    const runningThread = this.threads.get(threadID)

    if(!runningThread) {
      throw new Error(`No active thread found for ${threadID}`)
    }

    await runningThread.stopQuery()
  } 

  async *sendMessage(input: AIMessage): AsyncGenerator<ServerNotification> {
    let findThread = this.threads.get(input.threadID);

    // Making new thread...
    if (!findThread) {
      console.log("A thread does not exist making a new one...")
      const project = getProjectByThreadID(input.threadID);

      if (!project) {
        throw new Error(`No project found for thread ${input.threadID}`);
      }

      findThread = new lightThread(this.codexInstance)
      
      findThread = await findThread.createThread(
        project.path
      );

      this.threads.set(input.threadID, findThread);
      this.recentThreads.push(findThread);
    }

    // A thread already exists
    storeMessage.get(
      crypto.randomUUID(),
      input.threadID,
      input.message,
      input.model.model,
      input.model.thinking,
      "user",
      nextMessageSequence(input.threadID),
    );

    console.log(`Sending message to ${input.model.model} with ${input.model.thinking}`)

    for await (const event of findThread.sendQueryStream(input.model.model, input.model.thinking as ModelReasoningEffort, input.message)) {
      console.log("Event received: ", event);
      if(event.method == 'item/completed' 
        && event.params.item.phase == 'final_answer') {
        storeMessage.get(
          crypto.randomUUID(),
          input.threadID,
          event.params.item.text,
          input.model.model,
          input.model.thinking,
          "assistant",
          nextMessageSequence(input.threadID),
        );
      }
      yield event;
    }
  }

  deleteThread(threadID: string) {
    if(this.threads.has(threadID)) {
      this.threads.delete(threadID);
    }

    deleteThread.get(threadID);
  }

  async generateTitle(threadID: string): Promise<string> {
    const existing = getThreadByID(threadID);
    if (existing && existing.name && existing.name !== "Untitled chat") {
      return existing.name;
    }

    // Get the first message from the thread
    const messages = loadMessagesFromThread(threadID);
    const firstMessage = messages.find((message) => message.role === "user")?.text;

    if (!firstMessage) {
      throw new Error("No user message found in the thread");
    }

    let title = "";

    const runningThread = await this.codexInstance.startThread({});

    for await (const event of this.codexInstance.streamTurn({
      threadId: runningThread.thread.id,
      model: "gpt-5.4-mini",
      effort: "low",
      input: [
        {
          type: "text",
          text: `Generate a short title only for this user message:\n${firstMessage}`,
          text_elements: [],
        },
      ],
    })) {
      if (
        event.method === "item/completed" &&
        event.params.item.type === "agentMessage"
      ) {
        title = event.params.item.text.trim();
      }
    }

    renameThread.get(title, threadID);

    // The turn is completed here
    return title;
  }
}
