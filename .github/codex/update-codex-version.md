The workflow has updated the exact `@openai/codex` dependencies in
`packages/codex-protocol/package.json` and `apps/novus/package.json` to the
latest published version.

Regenerate and verify the protocol by running:

1. `npm run generate -w @lightcode/codex-protocol`
2. `npm run protocol:check -w @lightcode/codex-protocol`
3. `npm run typecheck -w @lightcode/codex-protocol`

Inspect any failures and feel free to spin up some subagents. Make only the changes required for compatibility with the updated Codex version. Change the selected Codex version. Make sure to make a new branch and commit/push these changes. Then make a PR for this change.
