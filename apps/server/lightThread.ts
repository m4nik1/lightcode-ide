import { type ModelReasoningEffort, type Codex, type Thread } from "@openai/codex-sdk";
import {
  CodexAppServerClient,
  ThreadStartResponse,
  type InitializeThreadResponse,
} from '@lightcode/codex-protocol'

export default class lightThread {
  codexInstance: CodexAppServerClient;
  thread: null | ThreadStartResponse;
  turnId: null | string;
  id: null | string;
  constructor(codexInstance: CodexAppServerClient) {
    this.codexInstance = codexInstance
    this.thread = null;
    this.id = null;
    this.turnId = null;
  }

  async createThread(model: string, thinking: ModelReasoningEffort, path : string) {
    console.log("Creating thread, model: ", model, " thinking: ", thinking)

    // this.thread = this.codexInstance.startThread({model, modelReasoningEffort: thinking, workingDirectory: path});

    // The approval policy is about the full access dropdown that is shown
    this.thread = await this.codexInstance.startThread({
      cwd: path,
      sandbox: 'workspace-write',
      approvalPolicy: 'never',
    }) 

    console.log("Started new thread: ", this.thread)

    this.id = this.thread.thread.id;

    return this;
  }

  async stopQuery() {
    // The thread should stop here
    if(this.thread === null || this.id === null || this.turnId === null) {
      throw new Error("Thread has not been created or turn has not been started")
    }

    await this.codexInstance.interruptTurn({
      threadId: this.id,
      turnId: this.turnId
    })
  }

  async *sendQueryStream(query: string) {
    if (!this.thread || !this.id) {
      throw new Error("Thread has not been created")
    }

    for await (const event of this.codexInstance.streamTurn({
      threadId: this.id,
      input: [
        {
          type: "text",
          text: query,
          text_elements: [],
        },
      ],
    })) {
      console.log(event)
      yield event;
    }
  }

  getInstance() {
    return this.codexInstance
  }
}
