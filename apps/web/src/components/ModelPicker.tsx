import { type ReactNode } from "react";
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
import { AI_MODEL_IDS, type AIModelId, type AIReasoningEffort } from "../lib/aiModelConfig";

export type PickerOption<TValue extends string> = {
  label: string;
  value: TValue;
  description?: string;
};

const modelLabels: Record<AIModelId, string> = {
  "gpt-6-astra": "GPT-6 Astra",
  "gpt-6.1-sol": "GPT-6.1 Sol",
  "gpt-6-luna": "GPT-6 Luna",
};

const modelOptions: PickerOption<AIModelId>[] = AI_MODEL_IDS.map((value) => ({
  label: modelLabels[value],
  value,
}));

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
  const { model, modelSet } = useAIChat();
  const selectedModel = model.model;
  const thinkingLevel = model.thinking;

  function modelSelected(model: AIModelId) {
    modelSet(model, thinkingLevel);
  }

  function thinkingSelected(thinking: AIReasoningEffort) {
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
