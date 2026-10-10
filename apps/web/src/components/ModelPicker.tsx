import { useState, type ReactNode } from "react";
import { BrainIcon, CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import OpenAIIcon from "./icons/OpenAIIcon";
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
  {
    label: "GPT-6 Astra",
    value: 'gpt-6-astra',
  },
  {
    label: "GPT-5.6 Sol",
    value: "gpt-5.6-sol",
  },
  {
    label: "GPT-5.6 Terra",
    value: "gpt-5.6-terra",
  },
  { label: "GPT-5.6 Luna", value: "gpt-5.6-luna" },
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
            "group/trigger inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg px-2 text-[15px] font-normal transition-colors focus-visible:outline-none focus-visible:ring-2",
            aiThemeClassNames.focusRing,
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.dataOpenSurfaceHover,
            triggerClassName ??
              cn(aiThemeClassNames.textSecondary, aiThemeClassNames.hoverTextPrimary),
          )}
        >
          {triggerLeading}
          {selectedLabel}
          {showChevron ? <ChevronDownIcon aria-hidden="true" className="-ml-0.5 size-4 opacity-60 transition-transform group-data-[state=open]/trigger:rotate-180" /> : null}
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

export function ToolbarDivider() {
  return (
    <span
      aria-hidden="true"
      className={cn("mx-1 h-5 w-px shrink-0", aiThemeClassNames.divider)}
    />
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
    <>
      <PickerDropdown
        options={modelOptions}
        value={selectedModel}
        onSelect={modelSelected}
        menuWidth="min-w-52"
        triggerLeading={<OpenAIIcon className="size-[18px]" aria-hidden="true" />}
      />
      <ToolbarDivider />
      <PickerDropdown
        options={thinkingOptions}
        value={thinkingLevel}
        onSelect={thinkingSelected}
        menuWidth="min-w-40"
        triggerLeading={<BrainIcon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />}
      />
    </>
  );
}
