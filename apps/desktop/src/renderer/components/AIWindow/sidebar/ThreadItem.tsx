import { cn } from "../../../lib/utils";
import { ThreadIcon } from "./icons";
import type { thread } from "./types";
import { aiThemeClassNames } from "../theme";

type ThreadItemProps = {
  thread: thread;
};

export function ThreadItem({ thread }: ThreadItemProps) {
  return (
    <button
      type="button"
      onClick={() => console.log("Thread has been selected")}
      className={cn(
        "group relative flex min-h-7 w-full select-none items-center gap-1.5 rounded-xl py-1 pr-3 pl-[30px] text-left text-xs transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
        aiThemeClassNames.borderFocus,
        cn(aiThemeClassNames.surfaceActive, aiThemeClassNames.textPrimary),
      )}
    >
      <span
        className={cn(
          "flex size-3 shrink-0 items-center justify-center transition-colors",
          cn(aiThemeClassNames.textMuted, "group-hover:text-[#ededed]"),
        )}
      >
        <ThreadIcon />
      </span>
      <span className="min-w-0 truncate">New Thread</span>
    </button>
  );
}
