import { cn } from "../../../lib/utils";
import { ThreadIcon } from "./icons";
import type { AIThread } from "./types";
import { aiThemeClassNames } from "../theme";

type ThreadItemProps = {
  thread: AIThread;
  active: boolean;
  onSelect: () => void;
};

export function ThreadItem({ thread, active, onSelect }: ThreadItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex min-h-7 w-full select-none items-center gap-1.5 rounded-xl py-1 pr-3 pl-[30px] text-left text-xs transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
        aiThemeClassNames.borderFocus,
        active
          ? cn(aiThemeClassNames.surfaceActive, aiThemeClassNames.textPrimary)
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
          active
            ? aiThemeClassNames.textPrimary
            : cn(aiThemeClassNames.textMuted, "group-hover:text-[#ededed]"),
        )}
      >
        <ThreadIcon />
      </span>
      <span className="min-w-0 truncate">{thread.title}</span>
    </button>
  );
}
