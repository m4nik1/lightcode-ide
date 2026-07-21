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

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => setCurrentThread(thread)}
      className={cn(
        "group relative flex min-h-7 w-full select-none items-center gap-1.5 rounded-xl py-1 pr-3 pl-[30px] text-left text-xs transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
        aiThemeClassNames.borderFocus,
        isSelected
          ? cn(aiThemeClassNames.selectedSurface, aiThemeClassNames.textPrimary)
          : cn(
              aiThemeClassNames.textMuted,
              aiThemeClassNames.surfaceHover,
              aiThemeClassNames.hoverTextPrimary,
            ),
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
  );
}
