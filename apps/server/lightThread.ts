import { type Codex } from "@openai/codex-sdk";


export default class lightThread {
  constructor(codexInstance: Codex) {
    this.codexInstance = codexInstance
    this.thread = null;
  }

  createThread() {
    console.log("Creating thread")


  }
}
