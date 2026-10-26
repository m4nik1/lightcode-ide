## Proposal-First Workflow

- Inspect the relevant code and project conventions before proposing a change.
- Before editing, explain the intended changes, the files involved, and the reasoning behind them.
- Prefer a concise implementation plan or diff that the user can review and learn from.
- Wait for explicit user approval before modifying files or running commands that change project state.
- When implementing an approved change, explain the important decisions and verify the result with relevant tests or checks.
- Treat a direct request to implement a specific change as explicit approval for that change.

## Long Explanations

- When an explanation or proposal is long (multiple files, diffs, or sections), present it as an HTML page instead of a long chat message.
- Delegate building the page to a Claude Sonnet 5.5 subagent that uses the frontend-design skill.
- Keep the styling minimal, like shadcn/Vercel: neutral colors, clean type, plain bordered code blocks, diffs with green/red lines.
- Structure the page for reading: a short summary up top, explanation next to each code snippet, collapse very long code, end with how to verify.
- Show the page inline in the thread, and keep the chat reply short.
