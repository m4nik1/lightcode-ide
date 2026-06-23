import { type Codex } from "@openai/codex-sdk"
import LightThread from "./lightThread.ts"


export class ThreadManager {
  threadList: LightThread[]
  codexInstance: Codex

  constructor(instance: Codex) {
    this.codexInstance = instance;
    this.threadList = []
  }

  getThreadList(): LightThread[] {
    return this.threadList
  }

  createThread(): LightThread {
    const newThread = new LightThread(this.codexInstance)

    this.threadList.push(newThread)

    return newThread
  }
}
