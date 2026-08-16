# Codex Collaboration Mode

## Overview

The current upstream Codex app-server v2 protocol supports selecting a
collaboration mode per `turn/start` request. This includes Plan mode and the
default Build mode.

The field is named `collaborationMode` in the JSON wire format. The upstream
Codex TUI passes this field when it starts a turn, and the upstream test suite
verifies Plan mode using the same request shape.

## Plan-mode request

The JSON-RPC request is conceptually:

```json
{
  "method": "turn/start",
  "id": 1,
  "params": {
    "threadId": "thread-id",
    "input": [
      {
        "type": "text",
        "text": "Plan this task",
        "text_elements": []
      }
    ],
    "collaborationMode": {
      "mode": "plan",
      "settings": {
        "model": "gpt-5.4",
        "reasoning_effort": "medium",
        "developer_instructions": null
      }
    }
  }
}
```

`mode: "plan"` selects the Plan collaboration mode. Setting
`developer_instructions` to `null` tells Codex to use the built-in instructions
for the selected mode. A concrete developer-instruction string can be used to
override those instructions when needed.

## TypeScript usage

Once the local protocol types include the current upstream field, the package
can pass the mode through `streamTurn()`:

```ts
for await (const event of client.streamTurn({
  threadId,
  model,
  effort: thinking,
  input: [
    {
      type: "text",
      text: query,
      text_elements: [],
    },
  ],
  collaborationMode: {
    mode: "plan",
    settings: {
      model,
      reasoning_effort: "medium",
      developer_instructions: null,
    },
  },
})) {
  yield event;
}
```

The mode is attached to the turn request, so it can be changed for a later
turn on the same thread.

## State of this repository

The generated type currently used by
`packages/codex-protocol/src/client.ts` is
`packages/codex-protocol/src/generated/v2/TurnStartParams.ts`. At present it
does not contain a `collaborationMode` field, even though the upstream Codex
app-server protocol supports it.

The protocol types should be regenerated from a newer compatible Codex
protocol/schema version rather than manually editing the generated file. After
regeneration, `TurnStartParams` should expose a field equivalent to:

```ts
collaborationMode?: CollaborationMode | null;
```

The pinned Codex app-server executable must also support the newer protocol
field. Updating only the TypeScript type would make the code compile but would
not guarantee that the launched server accepts the request.

Until the protocol types and pinned executable are updated, the repository's
existing `developerInstructions` approach remains the compatibility fallback:
configure Plan-mode instructions when starting or resuming the thread.

## Upstream references

- [Codex app-server README](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md)
- [Codex MCP interface documentation](https://github.com/openai/codex/blob/main/codex-rs/docs/codex_mcp_interface.md)
- [Upstream TUI app-server session](https://github.com/openai/codex/blob/main/codex-rs/tui/src/app_server_session.rs)
- [Upstream `turn/start` test](https://github.com/openai/codex/blob/main/codex-rs/app-server/tests/suite/v2/turn_start.rs)
