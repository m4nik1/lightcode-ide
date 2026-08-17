import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useView } from "../../context/useView";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "../../theme";

export default function SettingsSidebar() {
  const { setView } = useView();

  return (
    <aside
      className={cn(
        "relative box-border flex h-full w-65 shrink-0 flex-col border-r text-[13px]",
        aiThemeClassNames.sidebar,
        aiThemeClassNames.border,
        aiThemeClassNames.sidebarDepth,
        aiThemeClassNames.textPrimary,
      )}
    >
      <header className="shrink-0 px-5 pb-5 pt-10">
        <h1 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">
          Settings
        </h1>
      </header>

      <nav aria-label="Settings sections" className="min-h-0 flex-1 px-2">
        <button
          type="button"
          aria-current="page"
          className={cn(
            "flex w-full cursor-default items-center gap-2 rounded-xl px-3 py-2 text-left font-medium focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
            aiThemeClassNames.selectedSurface,
            aiThemeClassNames.textPrimary,
            aiThemeClassNames.borderFocus,
          )}
        >
          <SlidersHorizontal
            className={cn("size-4 shrink-0", aiThemeClassNames.textMuted)}
            aria-hidden="true"
          />
          General
        </button>
      </nav>

      <div className={cn("shrink-0 border-t p-3", aiThemeClassNames.border)}>
        <button
          type="button"
          onClick={() => setView("chat")}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
            aiThemeClassNames.textPrimary,
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.focusVisibleSurfaceHover,
            aiThemeClassNames.borderFocus,
          )}
        >
          <ArrowLeft
            className={cn("size-4 shrink-0", aiThemeClassNames.textMuted)}
            aria-hidden="true"
          />
          Back to chat
        </button>
      </div>
    </aside>
  );
}
