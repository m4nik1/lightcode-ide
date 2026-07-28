import {
  type Codex,
  type ModelReasoningEffort,
  type ThreadEvent,
} from "@openai/codex-sdk";
import lightThread from "./lightThread.ts";
import {
  getProjectByThreadID,
  nextMessageSequence,
  storeMessage,
} from "./lightQueries.ts";
import { CodexAppServerClient } from "@lightcode/codex-protocol";

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
  }

  async generateThreadTitle(userMessage: string): Promise<string> {
    const thread = this.codexInstance.startThread({
      model: "gpt-5.4-mini",
      modelReasoningEffort: "low",
    });
    const result = await thread.run(
      `Generate a short title only for this user message:\n${userMessage}`,
    );

    return result.finalResponse.trim();
  }

  stopTurn(threadID: string) {
    console.log("Interrupting turn")

    let runningThread : lightThread = this.threads.get(threadID)

    runningThread.stopQuery()
  } 

  async *sendMessage(input: AIMessage): AsyncGenerator<ThreadEvent> {
    let thread = this.threads.get(input.threadID);

    // Making new thread...
    if (!thread) {
      console.log("A thread does not exist making a new one...")
      const project = getProjectByThreadID(input.threadID);

      if (!project) {
        throw new Error(`No project found for thread ${input.threadID}`);
      }

      thread = new lightThread(this.codexInstance).createThread(
        input.model.model,
        input.model.thinking as ModelReasoningEffort,
        project.path,
      );
      this.threads.set(input.threadID, thread);
      this.recentThreads.push(thread);
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

    const events = await thread.sendQueryStream(input.message);

    console.log("events: ", events)
    console.log(`Sending message to ${input.model.model} with ${input.model.thinking}`)

    for await (const event of events) {
      if (
        event.type === "item.completed" &&
        event.item.type === "agent_message"
      ) {
        storeMessage.get(
          crypto.randomUUID(),
          input.threadID,
          event.item.text,
          input.model.model,
          input.model.thinking,
          "assistant",
          nextMessageSequence(input.threadID),
        );
      }
      yield event;
    }
  }

  getRecentThreads() {
    return this.recentThreads;
  }
}
