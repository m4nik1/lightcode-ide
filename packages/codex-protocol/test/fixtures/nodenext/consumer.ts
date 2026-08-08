import {
  CODEX_PROTOCOL_VERSION,
  CodexAppServerClient,
  type ServerNotification,
} from "@lightcode/codex-protocol";
import type { ClientRequest } from "@lightcode/codex-protocol/protocol";
import type { Thread } from "@lightcode/codex-protocol/protocol/v2";

const client = new CodexAppServerClient({
  clientInfo: { name: "fixture", title: null, version: "1" },
});
type IsStringLiteral<T extends string> = string extends T ? false : true;
const versionIsLiteral: IsStringLiteral<typeof CODEX_PROTOCOL_VERSION> = true;
const request: ClientRequest | undefined = undefined;
const notification: ServerNotification | undefined = undefined;
const thread: Thread | undefined = undefined;

void client;
void versionIsLiteral;
void request;
void notification;
void thread;
