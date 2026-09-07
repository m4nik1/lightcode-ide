import { Folder, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import type { thread } from "./types";
import { aiThemeClassNames } from "../../theme";
import { useAIChat } from "../../context/useAIChat";
import { trpcClient } from "../../utils/trpc";
import { CodexIcon } from "./icons";

type ThreadItemProps = {
  thread: thread;
  projectName: string;
  onDeleteThread: (threadID: string) => void;
};

export function ThreadItem({
  thread,
  projectName,
  onDeleteThread,
}: ThreadItemProps) {
  const { currentThread, setCurrentThread } = useAIChat();
  const isSelected = currentThread?.id === thread.id;

  async function handleDeleteThread() {
    try {
      await trpcClient.deleteThread.mutate({ threadID: thread.id });
      onDeleteThread(thread.id);
    } catch (error) {
      console.error("Failed to delete thread", error);
    }
  }

  return (
    <div
      className={cn(
        "group relative w-full select-none rounded-xl transition-colors",
        aiThemeClassNames.textPrimary,
        isSelected
          ? aiThemeClassNames.surfaceActive
          : aiThemeClassNames.surfaceHover,
      )}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => setCurrentThread(thread)}
        className={cn(
          "flex min-h-[56px] w-full min-w-0 cursor-pointer flex-col justify-center gap-0.5 rounded-xl px-3 py-2 text-left focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
          aiThemeClassNames.borderFocus,
        )}
      >
        <span
          className="flex w-full min-w-0 items-center gap-2 pr-7 text-[14px] leading-5"
          title={thread.title}
        >
          <span
            className={cn("size-4 shrink-0", aiThemeClassNames.textMuted)}
            role="img"
            aria-label="Codex"
            title="Codex"
          >
            <CodexIcon />
          </span>
          <span className="truncate">{thread.title}</span>
        </span>
        <span
          className={cn(
            "flex w-full min-w-0 items-center gap-1.5 text-[12px] leading-[18px]",
            aiThemeClassNames.textMuted,
          )}
          title={thread.projectPath}
        >
          <Folder
            aria-hidden="true"
            className="size-3.5 shrink-0"
            strokeWidth={1.5}
          />
          <span className="truncate">{projectName}</span>
        </span>
      </button>
      <button
        type="button"
        aria-label={`Delete ${thread.title}`}
        title="Delete thread"
        onClick={handleDeleteThread}
        className={cn(
          "absolute top-2 right-2 inline-flex size-6 cursor-pointer items-center justify-center rounded-md transition-[background-color,color,opacity] focus-visible:outline-1 focus-visible:outline-offset-[-1px] group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100",
          isSelected ? "opacity-100" : "opacity-0",
          aiThemeClassNames.textMuted,
          aiThemeClassNames.surfaceHover,
          aiThemeClassNames.hoverTextPrimary,
          aiThemeClassNames.focusVisibleSurfaceHover,
          aiThemeClassNames.focusVisibleTextPrimary,
          aiThemeClassNames.borderFocus,
        )}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
