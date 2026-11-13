import { query, type SDKMessage } from "@anthropic-ai/claude-agent-sdk";
import { CodexAppServerClient } from '@lightcode/codex-protocol'
import type { ThreadStartResponse } from '@lightcode/codex-protocol'
import type { AIReasoningEffort } from './aiModelConfig.ts'

const PLAN_MODE_INSTRUCTIONS = `<collaboration_mode>
# Collaboration Mode: Plan

Develop a complete implementation plan with the user.
Inspect the workspace using read-only operations only.
Do not edit files or run mutating commands until the collaboration mode changes.
</collaboration_mode>`;

export default class lightThread {
  codexInstance: CodexAppServerClient | null;
  thread: null | ThreadStartResponse;
  turnId: null | string;
  id: null | string;
  title: string;
  constructor(harnessInstance: CodexAppServerClient | null) {
    this.codexInstance = harnessInstance ?? null;
    this.thread = null;
    this.id = null;
    this.turnId = null;
    this.title = "Untitled Thread"
  }

  async createThread(path: string, access: "read-only" | "workspace-write" | "danger-full-access") {
    const codexInstance = this.codexInstance;
    if (codexInstance === null) {
      throw new Error("Harness is not available");
    }

    // The approval policy is about the full access dropdown that is shown
    this.thread = await codexInstance.startThread({
      cwd: path,
      sandbox: access,
      approvalPolicy: 'never',
    }) 

    console.log("Started new thread: ", this.thread)

    this.id = this.thread.thread.id;

    return this;
  }

  buildClaudeOptions(model: string, path: string) {
    return {
      cwd: path,
      allowedTools: ['read', 'Glob', 'Grep'],
      model: model,
      include_partial_messages=true,
    }
  }

  async stopTurn() {
    // The thread should stop here
    if(this.thread === null || this.id === null || this.turnId === null || this.codexInstance === null) {
      throw new Error("Thread has not been created or turn has not been started")
    }

    const turnInterrupt = await this.codexInstance.interruptTurn({
      threadId: this.id,
      turnId: this.turnId
    })

    console.log("Turn interrupted: ", turnInterrupt)
  }

  async *sendQueryStream(model: string, thinking: AIReasoningEffort, mode: "plan" | "build", query: string, isClaude : boolean) {
    if (!this.thread || !this.id) {
      throw new Error("Thread has not been created")
    }

    if(this.codexInstance == null) {
      throw new Error("Harness is not available");
    }

    if(!isClaude) {

      // Legacy: will be removed in the future
      const modeInstructions = mode === "plan"
        ? PLAN_MODE_INSTRUCTIONS : ""

      try {
        for await (const event of this.codexInstance.streamTurn({
          threadId: this.id,
          model: model,
          effort: thinking,
          input: [
            {
              type: "text",
              text: `${modeInstructions}\n\n${query}`,
              text_elements: [],
            },
          ],
        })) {
          // Remember the turn so stopTurn can interrupt it
          if (event.method == "turn/started") {
            this.turnId = event.params.turn.id;
          }
          console.log(event)
          yield event;
        }
      } finally {
        this.turnId = null;
      }
    } else {
      try {
        for await (const event of query(query, options=this.buildClaudeOptions(model, this.thread.cwd))) {
          // if(event)
        }
      }
    }
  }

  getInstance() {
    return this.codexInstance
  }
}
