import { Codex } from "@openai/codex-sdk"

export function sendTestMessage(message : string) {
  const codex = new codex()
  
  console.log("Making new thread")

  const result = await thread.run(
    message
  )

  console.log(result)
}

