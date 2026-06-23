import { Codex, type ThreadEvent } from "@openai/codex-sdk";
import { ThreadManager } from "./threadManager.ts";

export async function runCodex(message: string, user: string) {
  console.log("Run codex has been called: ", message, ' and user ', user);

  const codex = new Codex();

  const threadManager: ThreadManager = new ThreadManager(codex)
  const thread = threadManager.createThread()

  thread.createThread()
  const threadResult = await thread.sendQuery(message);

  console.log("Thread result: ", threadResult)

  return threadResult
}

export async function* runCodexStream(message: string): AsyncGenerator<ThreadEvent> {
  console.log("Running the codex stream")

  const codex = new Codex()

  const threadManager: ThreadManager = new ThreadManager(codex)
  const thread = threadManager.createThread()

  thread.createThread()
  const threadEvents = await thread.sendQueryStream(message)

  console.log("events: ", threadEvents)

  for await (const event of threadEvents) {
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
