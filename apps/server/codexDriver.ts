import { Codex } from "@openai/codex-sdk";
import { type threadManager } from "./threadManager.ts";

export async function runCodex(message: string, user: string) {
  console.log("Run codex has been called: ", message, ' and user ', user);

  const codex = new Codex();

  const threadManager: threadManager = new threadManager(codex)

  const threadResult = await threadManager.sendQuery(message);

  return threadResult
}
