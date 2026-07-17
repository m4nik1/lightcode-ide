import {
  type Codex,
  type ModelReasoningEffort,
  type ThreadEvent,
} from "@openai/codex-sdk";
import lightThread from "./lightThread.ts";
import { getProjectByThreadID, storeMessage } from "./lightQueries.ts";

type AIMessage = {
  threadID: string;
  projectID?: string;
  message: string;
  model: {
    model: string;
    thinking: string;
  };
  sequence?: string;
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

    const events = await thread.sendQueryStream(input.message);

    for await (const event of events) {
      if (event.type == 'item.completed' && event.item.type == 'agent_message') {
        console.log("Text has been complete: ", event.item.text);
        // Stored the message in db
        storeMessage.get(event.item.id, input.threadID, event.item.text, input.model.model, input.model.thinking, 'AI', 1)
      }
      yield event;
    }
  }

  getRecentThreads() {
    return this.recentThreads;
  }
}
