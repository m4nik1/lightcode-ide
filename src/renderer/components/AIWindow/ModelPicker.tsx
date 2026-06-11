import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"

const modelOptions = [
  { label: "GPT-5.5", value: "gpt-5.5" },
  { label: "Claude Sonnet 4.6", value: "claude-sonnet-4.6" },
]

export default function ModelPicker() {

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">GPT-5.5</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {
            modelOptions.map((model) => (
              <DropdownMenuItem>
                {model.label}
              </DropdownMenuItem>
            ))
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
