import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { cn } from "../../lib/utils"
import { aiThemeClassNames } from "./theme"

const modelOptions = [
  { label: "GPT-5.5", value: "gpt-5.5", description: "Most capable" },
  { label: "Claude 4.8 Opus", value: "claude-4.8-opus", description: "Most capable" },
  { label: "Claude Fable 5", value: "claude-5-fable", description: "Balanced" },
]

export default function ModelPicker() {
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].value)

  const selectedLabel =
    modelOptions.find((model) => model.value === selectedModel)?.label ??
    modelOptions[0].label


  function modelSelected(model: string) {
    console.log("User Chose ", model)

    setSelectedModel(model)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-7 items-center gap-1 rounded-lg border px-2.5 text-xs font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#525252]",
            aiThemeClassNames.border,
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.textMuted,
            aiThemeClassNames.hoverTextPrimary,
            aiThemeClassNames.dataOpenSurfaceHover,
          )}
        >
          {selectedLabel}
          <ChevronDownIcon className="size-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className={cn(
          "min-w-[280px] rounded-xl border p-1 shadow-lg ring-0",
          aiThemeClassNames.border,
          aiThemeClassNames.surface,
        )}
      >
        {modelOptions.map((model) => {
          return (
            <DropdownMenuItem
              key={model.value}
              variant="default"
              onClick={() => modelSelected(model.value)}
              className={cn(
                "focus:bg-[#171717] focus:text-[#ededed]",
                aiThemeClassNames.textPrimary,
              )}
            >
              <span className="font-normal">{model.label}</span>
              <span className={cn("text-xs", aiThemeClassNames.textMuted)}>
                {model.description}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
