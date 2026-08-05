import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "./theme";
import { useAIChat } from "@/context/useAIChat";
import type { AIModelId, AIReasoningEffort } from "@/lib/aiModelConfig";

type PickerOption<TValue extends string> = {
  label: string;
  value: TValue;
  description?: string;
};

const modelOptions: PickerOption<AIModelId>[] = [
  { label: "GPT-5.5", value: "gpt-5.5", description: "Most capable" },
  {
    label: "GPT-5.6-Sol",
    value: "gpt-5.6-sol",
    description: "Latest and greatest",
  },
  {
    label: "GPT-5.6-Terra",
    value: "gpt-5.6-terra",
    description: "Small but mighty",
  },
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
};

function PickerDropdown<TValue extends string>({
  options,
  value,
  onSelect,
  menuWidth,
}: PickerDropdownProps<TValue>) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? options[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/trigger inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-normal transition-[background-color,color,transform] focus-visible:outline-none active:translate-y-px",
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.textMuted,
            aiThemeClassNames.hoverTextPrimary,
            aiThemeClassNames.dataOpenSurfaceHover,
          )}
        >
          {selectedLabel}
          <ChevronDownIcon className="size-3 opacity-50 transition-transform group-data-[state=open]/trigger:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
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
    console.log("Model selected:", model, " and Thinking level:", thinkingLevel);
    modelSet(model, thinkingLevel);
  }

  function thinkingSelected(thinking: AIReasoningEffort) {
    setThinking(thinking);
    modelSet(selectedModel, thinking);
  }

  return (
    <div className="flex items-center">
      <PickerDropdown
        options={modelOptions}
        value={selectedModel}
        onSelect={modelSelected}
        menuWidth="min-w-56"
      />
      <span
        aria-hidden="true"
        className={cn("mx-1.5 h-4 w-px shrink-0", aiThemeClassNames.divider)}
      />
      <PickerDropdown
        options={thinkingOptions}
        value={thinkingLevel}
        onSelect={thinkingSelected}
        menuWidth="min-w-32"
      />
    </div>
  );
}
