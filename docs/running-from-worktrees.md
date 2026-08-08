# Running the app from a worktree

Worktrees (created under `.claude/worktrees/<name>`) are full checkouts of the repo,
but they do **not** share the main checkout's `node_modules`, so install once per worktree:

```sh
cd .claude/worktrees/<name>
npm install
```

This is fast (~20s) when the lockfile matches the main checkout, since npm reuses its cache.

Then run the pieces from the worktree root, each in its own terminal:

```sh
npm run server   # tRPC/codex server on http://localhost:2024 (required for chat)
npm run novus    # the AI window (Electron, via electron-forge + vite)
npm run desktop  # the IDE app, if needed
```

Notes:

- Start the server before sending messages — the novus renderer connects to
  `http://localhost:2024` (hardcoded in `apps/novus/src/utils/trpc.ts`).
- The server binds port 2024, so stop any server running from the main checkout
  (or another worktree) first, or the new one will fail to listen.
- `npm run typecheck` typechecks all workspaces; per-app lint lives in each app
  (e.g. `npm run lint -w @novus/app`).
- On Wayland, Electron may log a `wayland_surface_factory` / Vulkan error at
  startup — it's harmless.
