import { Codex } from "@openai/codex-sdk";
import { ThreadManager } from "./threadManager.ts";

export async function runCodex(message: string, user: string, model: string) {
  console.log("Run codex has been called: ", message, ' and user ', user, " with model ", model);

  const codex = new Codex();

  const threadManager: ThreadManager = new ThreadManager(codex)
  const thread = threadManager.createThread()

  thread.createThread()
  const threadResult = await thread.sendQuery(message);

  console.log("Thread result: ", threadResult)

  return threadResult
}
