import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "../../theme";
import SettingsDropdown, {
  type AppearanceTheme,
} from "./SettingsDropdown";
import useSettings from '../store/settingsStore.ts'

export default function SettingsPage() {
  const colorMode = useSettings((state) => state.colorMode);
  const setColorMode = useSettings((state) => state.setColorMode);

  return (
    <section
      aria-labelledby="general-settings-heading"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto",
        aiThemeClassNames.background,
        aiThemeClassNames.textPrimary,
      )}
    >
      <header className="flex min-h-14 shrink-0 items-center justify-between gap-4 px-7 py-3">
        <div className="flex min-w-0 items-center gap-4 text-[15px] font-medium">
          <span className={aiThemeClassNames.textMuted}>Settings</span>
          <span aria-hidden="true" className={aiThemeClassNames.textDisabled}>
            /
          </span>
          <span className="truncate">General</span>
        </div>

        <button
          type="button"
          onClick={() => setColorMode("Dark")}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-1 focus-visible:outline-offset-2",
            aiThemeClassNames.textMuted,
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.hoverTextPrimary,
            aiThemeClassNames.borderFocus,
          )}
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Restore defaults</span>
          <span className="sm:hidden">Reset</span>
        </button>
      </header>

      <div className="w-full px-7 pb-12 pt-14 sm:px-10 sm:pt-20">
        <div className="mx-auto w-full max-w-3xl">
          <h1
            id="general-settings-heading"
            className="m-0 text-[22px] font-semibold tracking-[-0.02em]"
          >
            General
          </h1>

          <div
            className={cn(
              "mt-7 flex flex-col gap-4 border-t py-5 sm:flex-row sm:items-center sm:justify-between",
              aiThemeClassNames.border,
            )}
          >
            <div className="min-w-0">
              <h2 className="m-0 text-[14px] font-medium">Appearance</h2>
              <p
                className={cn(
                  "mb-0 mt-1 text-[13px] leading-5",
                  aiThemeClassNames.textMuted,
                )}
              >
                Choose how Novus looks on this device.
              </p>
            </div>

            <SettingsDropdown
              value={colorMode}
              onValueChange={setColorMode}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
