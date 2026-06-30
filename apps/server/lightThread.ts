import { type ModelReasoningEffort, type Codex, type Thread } from "@openai/codex-sdk";


export default class lightThread {
  codexInstance: Codex;
  thread: null | Thread;
  constructor(codexInstance: Codex) {
    this.codexInstance = codexInstance
    this.thread = null;
  }

  createThread(model: string, thinking: ModelReasoningEffort) {
    console.log("Creating thread, model: ", model, " thinking: ", thinking)

    this.thread = this.codexInstance.startThread({model, modelReasoningEffort: thinking});
  }

  async sendQuery(query: string) {
    const result = await this.thread?.run(query)

    return result
  }

  async sendQueryStream(query: string) {
    if (!this.thread) {
      throw new Error("Thread has not been created")
    }

    const { events } = await this.thread.runStreamed(query);
    return events;
  }

  getInstance() {
    return this.codexInstance
  }
}
