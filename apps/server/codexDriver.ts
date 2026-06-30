import { Codex, type ModelReasoningEffort, type ThreadEvent } from "@openai/codex-sdk";
import { ThreadManager } from "./threadManager.ts";

interface modelConfig {
  model: string,
  thinking: string;
}

export async function runCodex(message: string, user: string, model : modelConfig) {
  console.log("Run codex has been called: ", message, ' and user ', user);

  const codex = new Codex();

  const threadManager: ThreadManager = new ThreadManager(codex)
  const thread = threadManager.createThread()

  thread.createThread(model.model, model.thinking as ModelReasoningEffort)
  const threadResult = await thread.sendQuery(message);

  console.log("Thread result: ", threadResult)

  return threadResult
}

export async function* runCodexStream(message: string, model : modelConfig): AsyncGenerator<ThreadEvent> {
  console.log("Running the codex stream")

  const codex = new Codex()

  const threadManager: ThreadManager = new ThreadManager(codex)
  const thread = threadManager.createThread()

  thread.createThread(model.model, model.thinking as ModelReasoningEffort)
  const threadEvents = await thread.sendQueryStream(message)

  for await (const event of threadEvents) {
    console.log("Event: ", event)
    switch (event.type) {
      case "item.completed":
        console.log("Item: ", event.item)
        break
      case "turn.completed":
        console.log("usage", event.usage)
        break
    }
    yield event;
  }
}
