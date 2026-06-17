import { Codex } from "@openai/codex-sdk";

export async function runCodex(message: string, user: string) {
  console.log("Run codex has been called: ", message, ' and user ', user);

  const codex = new Codex()

  const thread = codex.startThread()

  const resultAI = await thread.run(message)

  console.log("Result from AI: ", resultAI)
}
