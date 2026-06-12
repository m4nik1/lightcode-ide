import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { cn } from "@/lib/utils"

const modelOptions = [
  { label: "GPT-4o", value: "gpt-4o", description: "Most capable" },
  { label: "GPT-4 Turbo", value: "gpt-4-turbo", description: "Fast & smart" },
  { label: "GPT-3.5", value: "gpt-3.5", description: "Fastest" },
  { label: "Claude 3 Opus", value: "claude-3-opus", description: "Most capable" },
  { label: "Claude 3 Sonnet", value: "claude-3-sonnet", description: "Balanced" },
] as const

export default function ModelPicker() {
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].value)

  const selectedLabel =
    modelOptions.find((model) => model.value === selectedModel)?.label ??
    modelOptions[0].label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#333] bg-[#2a2a2a] px-2.5 text-xs font-normal text-[#c8c8c8] transition-colors hover:bg-[#333] hover:text-[#e8e8e8] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#555] data-[state=open]:bg-[#333]"
        >
          {selectedLabel}
          <ChevronDownIcon className="size-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="min-w-[280px] rounded-xl border border-[#333] bg-[#1e1e1e]/95 p-1 shadow-lg backdrop-blur-sm ring-0"
      >
        {modelOptions.map((model) => {
          const isSelected = model.value === selectedModel

          return (
            <DropdownMenuItem
              key={model.value}
              variant="default"
              className={cn(
                "flex cursor-default items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm focus:bg-[#2a2a2a] data-[highlighted]:bg-[#2a2a2a]",
                isSelected && "bg-[#2a2a2a]"
              )}
              onClick={() => setSelectedModel(model.value)}
            >
              <span className="font-medium text-[#f0f0f0]">{model.label}</span>
              <span className="text-xs text-[#888]">{model.description}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
