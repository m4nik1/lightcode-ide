import { type ModelReasoningEffort } from "@openai/codex-sdk";
import { CodexAppServerClient } from '@lightcode/codex-protocol'
import type { ThreadStartResponse } from '@lightcode/codex-protocol'

const PLAN_MODE_INSTRUCTIONS = `<collaboration_mode>
# Collaboration Mode: Plan

Develop a complete implementation plan with the user.
Inspect the workspace using read-only operations only.
Do not edit files or run mutating commands until the collaboration mode changes.
</collaboration_mode>`;

export default class lightThread {
  codexInstance: CodexAppServerClient;
  thread: null | ThreadStartResponse;
  turnId: null | string;
  id: null | string;
  title: string;
  constructor(codexInstance: CodexAppServerClient) {
    this.codexInstance = codexInstance
    this.thread = null;
    this.id = null;
    this.turnId = null;
    this.title = "Untitled Thread"
  }

  async createThread(path: string, mode: "build" | "plan", access: "read-only" | "workspace-write" | "danger-full-access") {
    const isPlanMode = mode === "plan";

    // The approval policy is about the full access dropdown that is shown
    this.thread = await this.codexInstance.startThread({
      cwd: path,
      sandbox: access,
      approvalPolicy: 'never',
      developerInstructions: isPlanMode ? PLAN_MODE_INSTRUCTIONS : null,
    }) 

    console.log("Started new thread: ", this.thread)

    this.id = this.thread.thread.id;

    return this;
  }

  async stopTurn() {
    // The thread should stop here
    if(this.thread === null || this.id === null || this.turnId === null) {
      throw new Error("Thread has not been created or turn has not been started")
    }

    const turnInterrupt = await this.codexInstance.interruptTurn({
      threadId: this.id,
      turnId: this.turnId
    })

    console.log("Turn interrupted: ", turnInterrupt)
  }

  async *sendQueryStream(model: string, thinking: ModelReasoningEffort, mode: "plan" | "build", query: string) {
    if (!this.thread || !this.id) {
      throw new Error("Thread has not been created")
    }

    for await (const event of this.codexInstance.streamTurn({
      threadId: this.id,
      model: model,
      effort: thinking,
      mode: mode,
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
