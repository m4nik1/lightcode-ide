import { Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ThreadIcon } from "./icons";
import type { thread } from "./types";
import { aiThemeClassNames } from "../theme";
import { useAIChat } from "@/context/useAIChat";

type ThreadItemProps = {
  thread: thread;
};

export function ThreadItem({ thread }: ThreadItemProps) {
  const { currentThread, setCurrentThread } = useAIChat();
  const isSelected = currentThread?.id === thread.id;

  function handleDeleteThread() {
    // TODO: Delete the thread.
  }

  return (
    <div
      className={cn(
        "group relative flex min-h-7 w-full select-none items-center rounded-xl text-xs transition-colors",
        isSelected
          ? cn(aiThemeClassNames.selectedSurface, aiThemeClassNames.textPrimary)
          : cn(
              aiThemeClassNames.textMuted,
              aiThemeClassNames.surfaceHover,
              aiThemeClassNames.hoverTextPrimary,
            ),
      )}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => setCurrentThread(thread)}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1.5 rounded-xl py-1 pr-1 pl-[30px] text-left focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
          aiThemeClassNames.borderFocus,
        )}
      >
        <span
          className={cn(
            "flex size-3 shrink-0 items-center justify-center transition-colors",
            aiThemeClassNames.textMuted,
            aiThemeClassNames.hoverTextPrimary,
          )}
        >
          <ThreadIcon />
        </span>
        <span className="min-w-0 truncate">{thread.title}</span>
      </button>
      <button
        type="button"
        aria-label={`Delete ${thread.title}`}
        onClick={handleDeleteThread}
        className={cn(
          "mr-2 inline-flex size-5 shrink-0 items-center justify-center rounded-md opacity-0 transition-[background-color,color,opacity] focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-[-1px] group-hover:opacity-100",
          aiThemeClassNames.textMuted,
          aiThemeClassNames.surfaceHover,
          aiThemeClassNames.hoverTextPrimary,
          aiThemeClassNames.focusVisibleSurfaceHover,
          aiThemeClassNames.focusVisibleTextPrimary,
          aiThemeClassNames.borderFocus,
        )}
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
