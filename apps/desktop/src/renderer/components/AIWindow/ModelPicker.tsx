import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const modelOptions = [
  { label: "GPT-5.5", value: "gpt-5.5", description: "Most capable" },
  { label: "Claude 4.8 Opus", value: "claude-4.8-opus", description: "Most capable" },
  { label: "Claude Fable 5", value: "claude-5-fable", description: "Balanced" },
] as const

type ModelValue = (typeof modelOptions)[number]["value"]

export default function ModelPicker() {
  const [selectedModel, setSelectedModel] = useState<ModelValue>(modelOptions[0].value)

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
        align="start"
        sideOffset={8}
        className="min-w-[280px] rounded-xl border border-[#333] bg-[#1e1e1e]/95 p-1 shadow-lg backdrop-blur-sm ring-0"
      >
        {modelOptions.map((model) => {
          return (
            <DropdownMenuItem
              key={model.value}
              variant="default"
              onClick={() => setSelectedModel(model.value)}
            >
              <span className="font-normal text-[#f0f0f0]">{model.label}</span>
              <span className="text-xs text-[#888]">{model.description}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
