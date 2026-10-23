import {
  CODEX_PROTOCOL_VERSION,
  CodexAppServerClient,
  type ServerNotification,
  type TurnStartParams,
} from "@lightcode/codex-protocol";
import type { ClientRequest } from "@lightcode/codex-protocol/protocol";
import type {
  Model,
  Thread,
  ThreadAttachmentListParams,
  ThreadAttachmentUpdatedNotification,
} from "@lightcode/codex-protocol/protocol/v2";

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

// Verify upgraded types through the built package's public entry points.
const attachmentParams = {
  threadId: "thread-1",
  limit: 10,
} satisfies ThreadAttachmentListParams;
const attachmentRequest = {
  id: 1,
  method: "thread/attachment/list",
  params: attachmentParams,
} satisfies ClientRequest;
const turnParams = {
  threadId: "thread-1",
  input: [],
  disabledPluginIds: [],
} satisfies TurnStartParams;
const modelMetadata: Pick<Model, "availableAccessPrograms"> = {
  availableAccessPrograms: { cyber: [] },
};
const originator: Thread["originator"] = null;

client.onNotification("thread/attachment/updated", (params) => {
  const attachment: ThreadAttachmentUpdatedNotification = params;
  // @ts-expect-error Attachment updates are thread-level, without a turn ID.
  params.turnId;
  void attachment;
});

// @ts-expect-error Codex 0.160.0 removed thread/rollback from the stable protocol.
const removedMethod: ClientRequest["method"] = "thread/rollback";

void attachmentRequest;
void turnParams;
void modelMetadata;
void originator;
void removedMethod;
