import type { CSSProperties } from "react";
import { SquarePen } from "lucide-react";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "../../theme";

type SidebarHeaderProps = {
  onNewChat?: () => void;
};

const dragStrip: CSSProperties = {
  height: 38,
  // @ts-expect-error -- Electron-specific CSS for draggable title bar
  WebkitAppRegion: "drag",
};

export function SidebarHeader({ onNewChat }: SidebarHeaderProps) {
  return (
    <div className="shrink-0">
      <div aria-hidden style={dragStrip} />
      <div className="px-2 pt-1 pb-2">
        <button
          type="button"
          onClick={onNewChat}
          className={cn(
            "flex h-8 w-full items-center gap-2.5 rounded-lg pr-2.5 pl-3 text-left text-[13px] font-medium transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
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
              "shrink-0 font-sans text-[11px]",
              aiThemeClassNames.textDisabled,
            )}
          >
            ⌘N
          </kbd>
        </button>
      </div>
    </div>
  );
}
