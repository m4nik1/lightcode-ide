
export default class claudeDriver {
  constructor() {
      
  }

  buildClaudeOptions(model: string, path: string) {
    return {
      cwd: path,
      allowedTools: ['read', 'Glob', 'Grep'],
      model: model,
    }
  }
}