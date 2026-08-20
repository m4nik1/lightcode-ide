import { SquarePen } from "lucide-react";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "../../theme";

type SidebarHeaderProps = {
  onNewChat?: () => void;
};

export function SidebarHeader({ onNewChat }: SidebarHeaderProps) {
  return (
    <div className="relative shrink-0 p-3 pt-10">
      <button
        type="button"
        onClick={onNewChat}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-[13px] transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
          aiThemeClassNames.surface,
          aiThemeClassNames.border,
          aiThemeClassNames.textPrimary,
          aiThemeClassNames.surfaceHover,
          aiThemeClassNames.focusVisibleSurfaceHover,
          aiThemeClassNames.borderFocus,
        )}
      >
        <SquarePen
          className={cn("size-4 shrink-0", aiThemeClassNames.textMuted)}
        />
        <span className="min-w-0 flex-1 truncate">New chat</span>
        <kbd
          className={cn(
            "ml-auto shrink-0 font-sans text-[11px] tracking-wide",
            aiThemeClassNames.textDisabled,
          )}
        >
          ⌘N
        </kbd>
      </button>
      <div
        className={cn(
          "mt-3 h-px w-full",
          aiThemeClassNames.divider,
        )}
      />
    </div>
  );
}
