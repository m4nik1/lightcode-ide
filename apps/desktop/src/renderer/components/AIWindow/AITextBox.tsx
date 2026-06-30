import { useRef, useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import ModelPicker from "./ModelPicker";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "./theme";
import { useAIChat } from "@/context/useAIChat";

export default function AITextBox() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const { messageSend } = useAIChat();

  const canSend = value.trim().length > 0;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      messageSend(value);
      setValue("");
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-[65%] min-h-22 min-w-22">
        <div
          className={cn(
            "flex flex-col rounded-2xl border shadow-sm transition-[border-color,box-shadow] focus-within:ring-1",
            aiThemeClassNames.border,
            aiThemeClassNames.surface,
            aiThemeClassNames.focusWithinBorder,
            aiThemeClassNames.focusWithinRing,
          )}
        >
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder=""
            rows={3}
            onKeyDown={(e) => handleKeyDown(e)}
            className={cn(
              "min-h-22 w-full resize-none border-0 bg-transparent px-4 pt-4 pb-12 text-[13px] shadow-none focus-visible:border-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
              aiThemeClassNames.textPrimary,
              "placeholder:text-[#737373]",
            )}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2.5">
            <ModelPicker />
            <button
              type="button"
              onClick={() => {
                void messageSend(value);
                setValue("");
              }}
              disabled={!canSend}
              aria-label="Send message"
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full border transition-colors",
                aiThemeClassNames.border,
                aiThemeClassNames.surfaceHover,
                canSend
                  ? cn(aiThemeClassNames.textPrimary, "hover:bg-[#1a1a1a]")
                  : cn(
                    aiThemeClassNames.textDisabled,
                    "cursor-not-allowed opacity-60",
                  ),
              )}
            >
              <ArrowUpIcon className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
