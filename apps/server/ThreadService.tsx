import { Codex } from "@openai/codex-sdk";
import lightThread from "./lightThread";

type AIMessage = {
  threadID: string;
  projectID: string;
  message: string;
  sequence: string;
};

export class ThreadService {
  recentThreads: lightThread[];
  codexInstance: Codex;
  constructor(AIDriver: Codex) {
    this.recentThreads = [];
    this.codexInstance = AIDriver;
  }

  sendMessage(input: AIMessage) {
    // Look up project path

    // Make a new thread
    const newThread = new lightThread(this.codexInstance);

    this.recentThreads.push(newThread.createThread("gpt-5.5", "low"));
  }

  getRecentThreads() {
    return this.recentThreads;
  }
}
