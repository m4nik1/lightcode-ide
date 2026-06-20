import { type Thread, type Codex } from "@openai/codex-sdk"
import { lightThread } from "./lightThread"

export interface threadManager {

}

export class threadManager {
  threadList: Thread[]
  codexInstance: null | Codex
  constructor(instance: Codex) {
    this.codexInstance = instance;
    this.threadList = []
  }

  getThreadList() {
    return this.threadList
  }

  createThread() {
    const newThread = new lightThread(this.codexInstance)

    this.threadList.push(newThread)

    return newThread
  }
}
