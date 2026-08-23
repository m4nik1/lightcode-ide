# Codex Collaboration Mode

## Overview

Lightcode uses the stable Codex app-server v2 protocol. Its generated
`TurnStartParams` does not expose the experimental `collaborationMode` request
field, so Lightcode provides Plan and Build behavior with per-turn prompt text.

## Stable Plan/Build requests

Plan policy is attached only to the text input of a Plan turn:

```text
<collaboration_mode>
# Collaboration Mode: Plan

Develop a complete implementation plan with the user.
Inspect the workspace using read-only operations only.
Do not edit files or run mutating commands until the collaboration mode changes.
</collaboration_mode>

Plan this task
```

Build turns do not include that Plan block. They begin with a short reset—
`Previous Plan-mode instructions no longer apply. Continue in Build mode.`—and
then include the original user query. This explicitly deactivates Plan behavior
that remains in the conversation history.

## TypeScript usage

The application constructs the text input before passing the stable request to
`streamTurn()`:

```ts
const modeInstructions = mode === "plan"
  ? PLAN_MODE_INSTRUCTIONS
  : "Previous Plan-mode instructions no longer apply. Continue in Build mode.";

for await (const event of client.streamTurn({
  threadId,
  model,
  effort: thinking,
  input: [
    {
      type: "text",
      text: `${modeInstructions}\n\n${query}`,
      text_elements: [],
    },
  ],
})) {
  yield event;
}
```

Neither `mode` nor `collaborationMode` is sent on the wire.

## State of this repository

`packages/codex-protocol` keeps `experimentalApi: false`, its existing generated
types, and its pinned Codex version. Lightcode does not place Plan policy in
thread-level `developerInstructions`, because those instructions would remain
active when the same thread switches to Build mode. This is intentionally an
application-level approximation rather than Codex's built-in Plan mode.

## Upstream references

- [Codex app-server README](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md)
- [Codex MCP interface documentation](https://github.com/openai/codex/blob/main/codex-rs/docs/codex_mcp_interface.md)
- [Upstream TUI app-server session](https://github.com/openai/codex/blob/main/codex-rs/tui/src/app_server_session.rs)
- [Upstream `turn/start` test](https://github.com/openai/codex/blob/main/codex-rs/app-server/tests/suite/v2/turn_start.rs)
