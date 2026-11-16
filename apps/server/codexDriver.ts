import type { CodexAppServerClient, ServerNotification, TurnInterruptParams, TurnStartParams } from "@lightcode/codex-protocol";

export default class codexDriver {
  private codex: CodexAppServerClient;
  
  constructor(codexInstance : CodexAppServerClient) {
    this.codex = codexInstance;
  }

  getInstance() {
    return this.codex;
  }

  streamTurn(params : TurnStartParams) : AsyncIterable<ServerNotification>{
    return this.codex.streamTurn(params)
  }

  interruptTurn(params : TurnInterruptParams) {
    return this.codex.interruptTurn(params)
  }
}
