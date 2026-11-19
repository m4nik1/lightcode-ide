import lightThread from "./lightThread.ts";
import {
  getProjectByThreadID,
  getThreadByID,
  loadMessagesFromThread,
  nextMessageSequence,
  storeMessage,
  renameThread,
  deleteThread,
  updateThreadType,
} from "./database/lightQueries.ts";
import { CodexAppServerClient } from "@lightcode/codex-protocol";
import type { lightHarness } from "./types.ts";
import type { ServerNotification } from "@lightcode/codex-protocol";
import type { SDKMessage } from "@anthropic-ai/claude-agent-sdk";
import { TITLE_MODEL_ID, type AIModelId, type AIReasoningEffort } from "./aiModelConfig.ts";

type AIMessage = {
  threadID: string;
  projectID?: string;
  message: string;
  model: {
    model: AIModelId;
    thinking: AIReasoningEffort;
  };
  access: "read-only" | "workspace-write" | "danger-full-access";
  mode: "build" | "plan";
};

export class ThreadService {
  recentThreads: lightThread[];
  threads: Map<string, lightThread>;
  // Threads with a turn currently streaming
  runningThreadIDs: Set<string>;
  harnessDriver: lightHarness;
  constructor(AIDriver: lightHarness) {
    this.recentThreads = [];
    this.threads = new Map();
    this.runningThreadIDs = new Set();
    this.harnessDriver = AIDriver;
  }

  async stopTurn(threadID: string) {
    console.log("Interrupting turn")

    const runningThread = this.threads.get(threadID)

    if (!runningThread) {
      throw new Error(`No active thread found for ${threadID}`)
    }

    await runningThread.stopTurn()
  }

  async *sendMessage(input: AIMessage): AsyncGenerator<ServerNotification | SDKMessage> {
    // One turn per thread; claim it before any async work so overlapping
    // requests can't store a message or clear another turn's running state
    if (this.runningThreadIDs.has(input.threadID)) {
      throw new Error(`Thread ${input.threadID} already has a turn running`);
    }

    this.runningThreadIDs.add(input.threadID);

    // This will turn into something sent by client
    let harness: lightHarness | null = null;

    try {
      let findThread = this.threads.get(input.threadID);

      // Making new thread...
      if (!findThread) {
        console.log("A thread does not exist making a new one...")
        const project = getProjectByThreadID(input.threadID);

        if (!project) {
          throw new Error(`No project found for thread ${input.threadID}`);
        }

        let harness;

        if (input.model.model.includes('gpt')) {
          // Do something specific for GPT models
          console.log("we are running a gpt model")
          harness = this.harnessDriver.codex

          // Set thread type to harness (type, id)
          updateThreadType.get('codex', input.threadID);
        }
        else if(input.model.model.includes('claude')) {
          harness = this.harnessDriver.claude
          updateThreadType.get('claude', input.threadID);
        }
        
        findThread = new lightThread(this.harnessDriver.codex.getInstance(), this.harnessDriver.claude);

        if(input.model.model.includes('gpt')) {
          findThread = await findThread.createThread(
            project.path,
            input.access,
          );
        }

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
      if(input.model.model.includes('gpt')) {
        for await (const event of findThread.sendCodexQueryStream(input.model.model, input.model.thinking, input.mode, input.message)) {
          // console.log("Event received: ", event);
          if (event.method == 'item/completed'
            && event.params.item.type === 'agentMessage'
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
      // This is for claude
      // TODO: Make sure to to give the input.threadID 
      // so thread can be stored as that id
      else {
        const project = getProjectByThreadID(input.threadID);
        if (!project) {
          throw new Error(`No project found for thread ${input.threadID}`);
        }

        for await (const event of findThread.sendClaudeQueryStream(input.model.model, input.model.thinking, input.message, input.threadID, project.path)) {
          // if (event.type === 'result' && event.subtype === 'success') {
          //   storeMessage.get(
          //     crypto.randomUUID(),
          //     input.threadID,
          //     event.result,
          //     input.model.model,
          //     input.model.thinking,
          //     "assistant",
          //     nextMessageSequence(input.threadID),
          //   );
          // }
          console.log('claude event: ', event)
          yield event;
        }
      }
    } finally {
      this.runningThreadIDs.delete(input.threadID);
    }
  }

  deleteThread(threadID: string) {
    if (this.threads.has(threadID)) {
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

    const runningThread = await this.harnessDriver.codex.getInstance().startThread({ ephemeral: true });

    for await (const event of this.harnessDriver.codex.getInstance().streamTurn({
      threadId: runningThread.thread.id,
      model: TITLE_MODEL_ID,
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

    if (title !== '' && title !== "Untitled chat") {
      renameThread.get(title, threadID);
    }

    // The turn is completed here
    return title;
  }
}
