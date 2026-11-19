import { query } from "@anthropic-ai/claude-agent-sdk"

export default class claudeDriver {

  buildClaudeOptions(model: string, path: string, sessionId: string, resume: boolean) {
    return {
      cwd: path,
      // First turn creates the session with our thread ID; later turns resume it
      ...(resume ? { resume: sessionId } : { sessionId }),
      allowedTools: ['Read', 'Glob', 'Grep'],
      model: model,
      permissionMode: 'acceptEdits' as const,
      includePartialMessages: true,
    }
  }

  streamTurn(prompt: string, sessionId: string, path: string, model: string, resume: boolean) {
    return query({ prompt, options: this.buildClaudeOptions(model, path, sessionId, resume) });
  }
}
