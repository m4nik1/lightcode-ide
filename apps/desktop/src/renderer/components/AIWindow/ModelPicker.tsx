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

type PickerOption = {
  label: string;
  value: string;
  description?: string;
};

const modelOptions: PickerOption[] = [
  { label: "GPT-5.5", value: "gpt-5.5", description: "Most capable" },
  {
    label: "Claude 4.8 Opus",
    value: "claude-4.8-opus",
    description: "Most capable",
  },
  { label: "Claude Fable 5", value: "claude-5-fable", description: "Balanced" },
];

const thinkingOptions: PickerOption[] = [
  { label: "low", value: "low" },
  { label: "medium", value: "medium" },
  { label: "high", value: "high" },
];

const itemFocusClassName = "focus:bg-[#171717] focus:text-[#ededed]";

type PickerDropdownProps = {
  options: PickerOption[];
  value: string;
  onSelect: (value: string) => void;
  menuWidth: string;
};

function PickerDropdown({
  options,
  value,
  onSelect,
  menuWidth,
}: PickerDropdownProps) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ??
    options[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/trigger inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-normal transition-colors focus-visible:outline-none",
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
          "rounded-xl border p-1 shadow-lg ring-0",
          menuWidth,
          aiThemeClassNames.border,
          aiThemeClassNames.surface,
        )}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              variant="default"
              onClick={() => onSelect(option.value)}
              className={cn(itemFocusClassName, aiThemeClassNames.textPrimary)}
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

  function modelSelected(model: string) {
    setSelectedModel(model);
    modelSet(model, thinkingLevel);
  }

  function thinkingSelected(thinking: string) {
    setThinking(thinking);
    modelSet(selectedModel, thinking);
  }

  return (
    <div className="flex items-center gap-1">
      <PickerDropdown
        options={modelOptions}
        value={selectedModel}
        onSelect={modelSelected}
        menuWidth="min-w-56"
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
