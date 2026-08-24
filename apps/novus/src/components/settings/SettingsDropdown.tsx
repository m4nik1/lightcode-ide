import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "../../theme";

export type AppearanceTheme = "light" | "dark";

const appearanceOptions: Array<{
  label: string;
  value: AppearanceTheme;
}> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

type SettingsDropdownProps = {
  value: AppearanceTheme;
  onValueChange: (value: AppearanceTheme) => void;
};

export default function SettingsDropdown({
  value,
  onValueChange,
}: SettingsDropdownProps) {
  const selectedLabel =
    appearanceOptions.find((option) => option.value === value)?.label ?? "Dark";

  return (
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
          const isSelected = option.value === value;

          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onValueChange(option.value)}
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
  );
}
