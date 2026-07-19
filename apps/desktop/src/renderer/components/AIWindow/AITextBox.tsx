import { useRef, useState, type KeyboardEvent } from "react";
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
      void messageSend(value);
      setValue("");
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative min-h-28 w-full min-w-0 sm:w-[75%]">
        <div
          className={cn(
            "relative flex min-h-28 flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#141414]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_32px_rgba(0,0,0,0.38)] backdrop-blur-xl transition-[border-color,box-shadow,background-color]",
            "focus-within:border-white/15 focus-within:bg-[#151515]/85 focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_36px_rgba(0,0,0,0.46)]",
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
              "min-h-28 w-full resize-none border-0 bg-transparent px-5 pt-5 pb-14 text-sm leading-6 shadow-none focus-visible:border-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
              aiThemeClassNames.textPrimary,
              "placeholder:text-[#737373]",
            )}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-3.5">
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
                "inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_10px_rgba(0,0,0,0.28)] transition-[background-color,border-color,box-shadow,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                canSend
                  ? cn(
                    aiThemeClassNames.textPrimary,
                    "hover:border-white/15 hover:bg-white/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.34)] active:bg-white/[0.08]",
                  )
                  : cn(
                    aiThemeClassNames.textDisabled,
                    "cursor-not-allowed opacity-60",
                  ),
              )}
            >
              <ArrowUpIcon className="size-[18px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
