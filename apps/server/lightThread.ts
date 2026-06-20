import { type Codex, type Thread } from "@openai/codex-sdk";


export default class lightThread {
  codexInstance: Codex;
  thread: null | Thread;
  constructor(codexInstance: Codex) {
    this.codexInstance = codexInstance
    this.thread = null;
  }

  createThread() {
    console.log("Creating thread")

    this.thread = this.codexInstance.startThread();
  }

  async sendQuery(query: string) {
    const result = await this.thread.run(query)

    return result
  }

  getInstance() {
    return this.codexInstance
  }
}
