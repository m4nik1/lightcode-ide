# `@lightcode/codex-protocol`

A private, typed Node.js client for the Codex app-server protocol. The package
spawns the pinned Codex CLI over stdio, owns the JSONL wire format, and exposes
generated TypeScript request, response, and notification types.

The package intentionally uses the stable protocol surface from
`@openai/codex@0.140.0`. It does not enable `experimentalApi`.

## Workspace dependency

Add the package to another workspace without publishing it:

```json
{
  "dependencies": {
    "@lightcode/codex-protocol": "workspace:*"
  }
}
```

The workspace `prepare` script builds `dist` during installation. Build output
is intentionally ignored by Git and can be recreated with `npm run build`.

## Connect

```ts
import {
  CodexAppServerClient,
  CODEX_PROTOCOL_VERSION,
} from "@lightcode/codex-protocol";

const client = new CodexAppServerClient({
  clientInfo: {
    name: "lightcode",
    title: "Lightcode",
    version: "0.1.0",
  },
});

const server = await client.connect();
console.log(CODEX_PROTOCOL_VERSION, server.userAgent);
```

`connect()` starts `codex app-server --stdio`, sends `initialize`, waits for its
response, and then sends `initialized`. Calling it again on the same connection
returns the original initialization response without another handshake.

The child process inherits the current environment. Pass `env` to add or
override variables, or `codexPathOverride` to launch a specific Codex native
executable.

## Start or resume a thread

```ts
const started = await client.startThread({
  cwd: "/absolute/path/to/project",
  model: "gpt-5.4",
  sandbox: "workspace-write",
  approvalPolicy: "never",
});

const threadId = started.thread.id;

await client.resumeThread({
  threadId,
  cwd: "/absolute/path/to/project",
});
```

Read an existing thread with `readThread()`. The returned `thread.name` is the
optional user-facing title; `thread.preview` is a useful fallback when no title
has been assigned. Set `includeTurns` when the rollout history is needed.

```ts
const { thread } = await client.readThread({
  threadId,
  includeTurns: false,
});

const title = thread.name ?? thread.preview;
console.log(title);
```

This first package version does not provide interactive approval handlers.
Known approval requests are declined, and unsupported server requests receive a
protocol error instead of being left pending.

The client must be connected before starting, resuming, reading, or interrupting
a thread or turn. Its `state` is one of `disconnected`, `connecting`,
`connected`, or `closed`; after `close()`, the client cannot be reused.

## Stream a turn

`streamTurn()` subscribes before sending `turn/start`, so notifications that
arrive before the request receipt are retained.

```ts
for await (const notification of client.streamTurn({
  threadId,
  input: [
    {
      type: "text",
      text: "Summarize this repository.",
      text_elements: [],
    },
  ],
})) {
  switch (notification.method) {
    case "item/agentMessage/delta":
      process.stdout.write(notification.params.delta);
      break;
    case "turn/completed":
      console.log(notification.params.turn.status);
      break;
  }
}
```

The iterator only yields notifications belonging to the requested thread and
turn, includes the terminal `turn/completed` notification, and then ends.

## Subscribe and interrupt

```ts
const unsubscribe = client.onNotification("turn/started", ({ threadId, turn }) => {
  console.log("turn started", threadId, turn.id);
});

await client.interruptTurn({
  threadId,
  turnId: "turn-id-from-turn-started",
});

unsubscribe();
```

Protocol errors can be observed without letting a listener exception disrupt
the stdout reader:

```ts
const stopErrors = client.onError((error) => {
  console.error(error);
});

const stopLogs = client.onStderr((text) => {
  process.stderr.write(text);
});
```

## Client options

`clientInfo` is required. The remaining options are optional:

| Option | Description |
| --- | --- |
| `codexPathOverride` | Launch a specific Codex executable instead of the pinned package binary; it must implement the same protocol version. |
| `env` | Environment variables merged over the current process environment. |
| `requestTimeoutMs` | Timeout for an individual app-server request; defaults to 30 seconds. |
| `notificationBufferSize` | Maximum number of queued turn notifications; defaults to 1,024. |
| `optOutNotificationMethods` | Notification methods to exclude during initialization. |

The notification buffer is bounded so a slow `streamTurn()` consumer cannot
grow memory without limit. Exceeding it raises `NotificationBufferOverflowError`.
`codexPathOverride` bypasses package-version resolution, so the caller is
responsible for keeping that executable compatible with `CODEX_PROTOCOL_VERSION`.

Always close the child process:

```ts
await client.close();
```

## Full generated schema

The root entry point exports the common chat types. The complete generated
surface is available through type-only subpath imports:

```ts
import type {
  ClientRequest,
  ServerNotification,
  ServerRequest,
} from "@lightcode/codex-protocol/protocol";

import type {
  Thread,
  ThreadItem,
  Turn,
} from "@lightcode/codex-protocol/protocol/v2";
```

Generated TypeScript types provide compile-time checking. The runtime transport
also validates the basic response/request/notification envelope shape, but it
does not perform full JSON Schema validation of every payload because it talks
to the matching, locally spawned CLI version.

## Regenerate after a Codex upgrade

Update the exact `@openai/codex` version in `package.json`, install it, then run:

```bash
npm run generate -w @lightcode/codex-protocol
npm run protocol:check -w @lightcode/codex-protocol
```

The generator reads the protocol version from the installed dependency and
verifies that it exactly matches `package.json`. It uses the stable surface,
updates `CODEX_PROTOCOL_VERSION`, and normalizes generated relative imports for
Node ESM. Do not edit `src/generated` manually.

## Verification

```bash
npm run typecheck -w @lightcode/codex-protocol
npm test -w @lightcode/codex-protocol
```

An optional smoke test starts the real local app-server, initializes it, and
closes it without creating a thread:

```bash
npm run test:smoke -w @lightcode/codex-protocol
```
