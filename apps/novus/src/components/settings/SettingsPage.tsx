import { useState } from "react";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";

type AppearanceTheme = "light" | "dark";

const appearanceOptions: Array<{
  label: string;
  value: AppearanceTheme;
}> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export default function SettingsPage() {
  const [appearance, setAppearance] = useState<AppearanceTheme>("dark");

  const selectedLabel =
    appearanceOptions.find((option) => option.value === appearance)?.label ??
    "Dark";

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
          onClick={() => setAppearance("dark")}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Appearance: ${selectedLabel}`}
                  className={cn(
                    "group/appearance flex h-9 w-full shrink-0 items-center justify-between gap-3 rounded-lg border px-3 text-[13px] transition-[background-color,border-color,color] focus-visible:outline-1 focus-visible:outline-offset-2 sm:w-40",
                    aiThemeClassNames.surface,
                    aiThemeClassNames.border,
                    aiThemeClassNames.textPrimary,
                    aiThemeClassNames.surfaceHover,
                    aiThemeClassNames.borderFocus,
                    aiThemeClassNames.dataOpenSurfaceHover,
                  )}
                >
                  {selectedLabel}
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform group-data-[state=open]/appearance:rotate-180",
                      aiThemeClassNames.textMuted,
                    )}
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={6}
                className={cn(
                  "min-w-40 rounded-xl border p-1 ring-0",
                  aiThemeClassNames.border,
                  aiThemeClassNames.menuSurface,
                )}
              >
                {appearanceOptions.map((option) => {
                  const isSelected = option.value === appearance;

                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setAppearance(option.value)}
                      className={cn(
                        "cursor-pointer rounded-lg",
                        aiThemeClassNames.menuItemFocus,
                        aiThemeClassNames.textPrimary,
                      )}
                    >
                      <span>{option.label}</span>
                      {isSelected ? (
                        <Check className="ml-auto size-3.5" aria-hidden="true" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  );
}
