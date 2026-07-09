import {
  type Codex,
  type ThreadEvent,
} from "@openai/codex-sdk";
import lightThread from "./lightThread.ts";
import { getProjectsID } from './lightQueries.ts'

type AIMessage = {
  threadID?: string;
  projectID?: string;
  message: string;
  model: {
    model: string;
    thinking: string;
  };
  path: string;
  sequence?: string;
};

export class ThreadService {
  recentThreads: lightThread[];
  codexInstance: Codex;
  constructor(AIDriver: Codex) {
    this.recentThreads = [];
    this.codexInstance = AIDriver;
  }

  async sendMessage(input: AIMessage) {
  // : AsyncGenerator<ThreadEvent> {
    console.log("We got the message: ", input);

    // const getProjectPath = getProjectsID.get(input.projectID);

    // const thread = new lightThread(this.codexInstance).createThread(
    //   input.model.model,
    //   input.model.thinking as ModelReasoningEffort,
    //   input.path,
    // );




    // this.recentThreads.push(thread);
    // const events = await thread.sendQueryStream(input.message);

    // for await (const event of events) {
    //   yield event;
    // }
  }

  getRecentThreads() {
    return this.recentThreads;
  }
}
