# Release Notes — Next Release

This release expands the AI experience in M4 Code IDE with a redesigned AI window, persistent conversations, and structured collaboration controls.

## Highlights

### New features

- Added turn-based Plan and Collaboration modes for structured AI workflows.
- Added access-mode selection for controlling AI capabilities.
- Added `Shift+Tab` mode switching.
- Added persistent projects, threads, and messages.
- Added automatic thread-title generation.
- Added model and thinking-level selection.
- Added the ability to stop an AI turn while it is running.
- Added Markdown rendering, streaming responses, loading states, and shimmer effects.
- Added project creation and project selection in the AI sidebar.
- Added message deletion support.
- Added a separate Novus AI window application.
- Added dynamic Codex protocol generation and updated protocol support.
- Added refreshed macOS application icons and packaging assets.

### UI and usability

- Redesigned the AI composer and chat interface.
- Improved sidebar sizing and thread-item layout.
- Improved model and access pickers.
- Updated typography, spacing, icons, and visual alignment.
- Improved textbox sizing, scrolling, and loading behavior.
- Fixed composer width and mode-toggle issues.
- Fixed thread-title generation and model-picker behavior.
- Newest threads are now shown first.

### Infrastructure

- Migrated thread handling to the app server.
- Added a server-backed thread service and persistence layer.
- Added tRPC streaming support for AI responses.
- Added generated Codex protocol types and transport tests.
- Improved connection closing and stdin-stream error handling.
- Migrated the project to a multi-app workspace structure.

## Notes

- This release remains macOS-focused.
- The AI window and Codex protocol layers underwent a broad internal migration. Existing integrations may need updates to match the new server-backed thread architecture.

This release includes changes from `alpha-2` through commit `76cd6a0`.
