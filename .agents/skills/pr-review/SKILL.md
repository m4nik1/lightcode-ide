---
name: pr-review
description: Review a pull request independently with Claude Opus 5.5, GPT-6.1 Sol medium, and DeepSeek V4.1 Flash high through OpenCode, then return concise, validated findings. Use for this three-model review workflow; implementation and posting reviews require a separate request.
---

# PR review

Run three independent reviews and consolidate concrete regressions into a short, readable result. This skill authorizes delegation for the review. Respect user overrides to models, reasoning, or scope.

## Establish the target

Read applicable AGENTS.md instructions and inspect checkout status. Identify the PR from the supplied URL or current branch using connected tools or `gh pr view`. Confirm repository, base, head SHA, and whether the checkout matches. Review the actual merge-base diff, excluding unrelated local edits. Inspect the remote diff read-only if needed instead of switching a dirty checkout.

In T3, register the PR with `link_pull_request` when available. Review is read-only: no edits, dependency installs, artifact-generating commands, GitHub comments/reviews, merges, or closing PRs unless separately requested.

## Select reviewers

Discover provider/model IDs and option descriptors with T3 `orchestrator_capabilities`; search when a model is omitted from the initial list. Defaults:

| Reviewer | Provider | Model | Options |
| --- | --- | --- | --- |
| Opus | Claude | Claude Opus 5.5 | Provider default effort unless user specifies |
| Sol | Codex | GPT-6.1 Sol | `reasoningEffort: medium` |
| DeepSeek | OpenCode | DeepSeek V4.1 Flash | `variant: high` |

Known IDs are `claudeAgent` / `claude-opus-5-5`, `codex` / `gpt-6.1-sol`, and `opencode` / `openrouter/deepseek/deepseek-v4.1-flash`. Verify against the live catalog. Do not silently substitute Flash Latest, a free variant, another model, or another reasoning level. Report unavailable selections; continue available independent reviews without claiming the full trio ran.

Use T3 `delegate_task` for cross-provider work and whenever options are requested or inherited. Pass settings in `target.options`, not just the prompt. Check returned provider, model, and options. Preserve inherited unrelated settings when supported. Retain every task ID and use a distinct stable `clientRequestId` per reviewer and round. These are child tasks, not top-level conversations.

If T3 tools are absent from discovery, make one bounded direct capability call. If still absent, use the documented ACP MCP fallback when configured. Otherwise explain the limitation; do not replace requested reviewers with native agents of different models.

## Delegate independently

Give each reviewer the same PR URL, repository path, verified head SHA, base/diff instructions, and this brief:

> Review the entire PR independently for concrete bugs and regressions. Read AGENTS.md and relevant callers, state lifecycles, and tests. Remain read-only; do not modify files, install dependencies, generate artifacts, post to GitHub, monitor the PR, or delegate further. Use checks that do not change project state. Return actionable findings with severity, exact file/line, trigger, user impact, and evidence. Exclude style-only concerns, speculative problems, and pre-existing issues. State reviewed SHA, checks run, and limitations. Keep the result concise.

Use shared checkout isolation for read-only reviews. Prefer async tasks; tell the user which reviewers actually started. Follow T3 completion notifications rather than polling or spawning watchers. Report failures and avoid duplicating active tasks.

## Consolidate and validate

- Deduplicate results by root cause and verify reported behavior against the diff and surrounding code. Agreement is evidence, not proof; a single reviewer can find a valid bug.
- Compare suspected regressions with the base revision. Resolve disagreements about pre-existing behavior, severity, and failure conditions before calling findings confirmed. If more review is needed, create a new delegated round with the original brief, prior findings, responses, and unresolved objections; do not continue a review in the old child thread.
- Require a supported trigger and causal explanation, especially for races. Do not treat clean typechecks as proof of correct UI or streaming behavior.
- Consolidate checks already run. Repeat or broaden only for unresolved concerns. Distinguish static analysis from live integration testing. Verify the checkout stayed unchanged. In T3, check that the reviewed PR is registered before finishing.

## Return a short review

Lead with the PR link and recommendation. List confirmed findings in severity order, each with a short title, practical impact, and a file/line link. Use standard P1/P2/P3 severities consistently, not arbitrary reviewer numbering. Mention reviewer agreement only where useful. Finish with checks and material limitations. If no actionable bugs were found, say so without implying exhaustive correctness.

Keep the consolidated response short, ideally three to five findings and one verification sentence. Do not paste three full reviews. For longer explanations, follow repository presentation instructions. Review does not authorize implementing fixes; draft a fix proposal only when asked.
