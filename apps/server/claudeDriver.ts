import { query } from "@anthropic-ai/claude-agent-sdk"

export default class claudeDriver {

  buildClaudeOptions(model: string, path: string, session_id : string) {
    return {
      cwd: path,
      session_id: session_id,
      allowedTools: ['read', 'Glob', 'Grep'],
      model: model,
      permisionMode: 'acceptEdits'
    }
  }

  streamTurn(prompt : string, session_id: string, path: string, model : string) {
    return query({prompt, options: this.buildClaudeOptions(model, path, session_id)});
  }
}
