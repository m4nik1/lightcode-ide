import { CodexAppServerClient } from "@lightcode/codex-protocol";

export default class CodexProvider {
  private instance: CodexAppServerClient;

  constructor(codex : CodexAppServerClient) {
    this.instance = codex
  }

  getInstance() {
    return this.instance;
  }

  async connect() {
    await this.instance.connect();
  }


  async close() {
    await this.instance.close();
  }
}