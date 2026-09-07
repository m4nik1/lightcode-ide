import { useState, type ReactNode } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";
import { useAIChat } from "../context/useAIChat";
import type { AIModelId, AIReasoningEffort } from "../lib/aiModelConfig";

export type PickerOption<TValue extends string> = {
  label: string;
  value: TValue;
  description?: string;
};

const modelOptions: PickerOption<AIModelId>[] = [
  { label: "GPT-5.6 Luna", value: "gpt-5.6-luna" },
  {
    label: "GPT-5.6 Sol",
    value: "gpt-5.6-sol",
  },
  {
    label: "GPT-5.6 Terra",
    value: "gpt-5.6-terra",
  },
  { label: "GPT-5.5", value: "gpt-5.5" },
];

const thinkingOptions: PickerOption<AIReasoningEffort>[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

type PickerDropdownProps<TValue extends string> = {
  options: PickerOption<TValue>[];
  value: TValue;
  onSelect: (value: TValue) => void;
  menuWidth: string;
  align?: "start" | "end";
  triggerLeading?: ReactNode;
  triggerClassName?: string;
  showChevron?: boolean;
};

export function PickerDropdown<TValue extends string>({
  options,
  value,
  onSelect,
  menuWidth,
  align = "start",
  triggerLeading,
  triggerClassName,
  showChevron = true,
}: PickerDropdownProps<TValue>) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? options[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/trigger inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg px-2 text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-2",
            aiThemeClassNames.focusRing,
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.dataOpenSurfaceHover,
            triggerClassName ??
              cn(aiThemeClassNames.textMuted, aiThemeClassNames.hoverTextPrimary),
          )}
        >
          {triggerLeading}
          {selectedLabel}
          {showChevron ? <ChevronDownIcon aria-hidden="true" className="size-3.5 opacity-50 transition-transform group-data-[state=open]/trigger:rotate-180" /> : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side="top"
        sideOffset={8}
        className={cn(
          "rounded-xl border p-1 ring-0",
          menuWidth,
          aiThemeClassNames.border,
          aiThemeClassNames.menuSurface,
        )}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              variant="default"
              onClick={() => onSelect(option.value)}
              className={cn(
                aiThemeClassNames.menuItemFocus,
                aiThemeClassNames.textPrimary,
              )}
            >
              {isSelected ? (
                <CheckIcon className="size-3.5" />
              ) : (
                <span className="size-3.5" aria-hidden />
              )}
              <span className="font-normal">{option.label}</span>
              {option.description ? (
                <span
                  className={cn("ml-auto text-xs", aiThemeClassNames.textMuted)}
                >
                  {option.description}
                </span>
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ModelPicker() {
  const { modelSet } = useAIChat();
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].value);
  const [thinkingLevel, setThinking] = useState(thinkingOptions[0].value);

  function modelSelected(model: AIModelId) {
    setSelectedModel(model);
    modelSet(model, thinkingLevel);
  }

  function thinkingSelected(thinking: AIReasoningEffort) {
    setThinking(thinking);
    modelSet(selectedModel, thinking);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Model: ${selectedModel}, reasoning: ${thinkingLevel}`}
          className={cn(
            "group/trigger inline-flex h-9 min-w-0 items-center gap-1.5 rounded-lg px-2 text-sm font-normal transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-white/5",
            aiThemeClassNames.textPrimary,
            aiThemeClassNames.focusRing,
          )}
        >
          <span className="truncate">{modelOptions.find((option) => option.value === selectedModel)?.label}</span>
          <span className="shrink-0 text-[#8C8C8C]">{thinkingOptions.find((option) => option.value === thinkingLevel)?.label}</span>
          <ChevronDownIcon aria-hidden="true" className="ml-0.5 size-4 shrink-0 text-[#8C8C8C] transition-transform group-data-[state=open]/trigger:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        sideOffset={12}
        className={cn("min-w-56 rounded-xl border p-1 ring-0", aiThemeClassNames.border, aiThemeClassNames.menuSurface)}
      >
        <DropdownMenuRadioGroup aria-label="Model" value={selectedModel} onValueChange={(model) => modelSelected(model as AIModelId)}>
          {modelOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} className={cn(aiThemeClassNames.textPrimary, aiThemeClassNames.menuItemFocus)}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className={aiThemeClassNames.divider} />
        <DropdownMenuLabel className={aiThemeClassNames.textMuted}>Reasoning</DropdownMenuLabel>
        <DropdownMenuRadioGroup aria-label="Reasoning" value={thinkingLevel} onValueChange={(thinking) => thinkingSelected(thinking as AIReasoningEffort)}>
          {thinkingOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} className={cn(aiThemeClassNames.textPrimary, aiThemeClassNames.menuItemFocus)}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
