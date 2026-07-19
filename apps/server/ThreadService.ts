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
  codexInstance: Codex;
  constructor(AIDriver: Codex) {
    this.recentThreads = [];
    this.threads = new Map();
    this.codexInstance = AIDriver;
  }

  async *sendMessage(input: AIMessage): AsyncGenerator<ThreadEvent> {
    let thread = this.threads.get(input.threadID);

    if (!thread) {
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
