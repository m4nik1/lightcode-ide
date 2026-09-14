import { Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import type { thread } from "./types";
import { aiThemeClassNames } from "../../theme";
import { useAIChat } from "../../context/useAIChat";
import { trpcClient } from "../../utils/trpc";

type ThreadItemProps = {
  thread: thread;
  onDeleteThread: (threadID: string) => void;
};

export function ThreadItem({ thread, onDeleteThread }: ThreadItemProps) {
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
    <li
      className={cn(
        // The rail: a 1px line at x=17px that joins this row to the project above.
        // Each row paints its own segment so stacked rows form one continuous line.
        "group relative flex h-8 w-full select-none items-center pl-[22px] text-[13px] before:absolute before:top-0 before:bottom-0 before:left-[17px] before:w-px before:transition-colors",
        isSelected ? aiThemeClassNames.railSelected : aiThemeClassNames.rail,
      )}
    >
      <div
        className={cn(
          "flex h-full min-w-0 flex-1 items-center rounded-lg transition-colors",
          isSelected
            ? cn(
                aiThemeClassNames.accentSoftSurface,
                aiThemeClassNames.textPrimary,
              )
            : cn(
                aiThemeClassNames.textMuted,
                aiThemeClassNames.surfaceHover,
                aiThemeClassNames.hoverTextPrimary,
              ),
        )}
      >
        <button
          type="button"
          aria-current={isSelected ? "true" : undefined}
          onClick={() => setCurrentThread(thread)}
          className={cn(
            "flex h-full min-w-0 flex-1 items-center rounded-lg pl-2.5 pr-1 text-left focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
            aiThemeClassNames.borderFocus,
          )}
        >
          <span className="min-w-0 truncate">{thread.title}</span>
        </button>
        <button
          type="button"
          aria-label={`Delete ${thread.title}`}
          onClick={handleDeleteThread}
          className={cn(
            "mr-1.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md opacity-0 transition-[background-color,color,opacity] focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-[-1px] group-hover:opacity-100",
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
    </li>
  );
}
