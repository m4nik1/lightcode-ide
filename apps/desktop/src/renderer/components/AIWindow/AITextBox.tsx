import { useRef, useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import ModelPicker from "./ModelPicker";
import { cn } from "../../lib/utils";
import { trpcClient } from "../../utils/trpc";
import { aiThemeClassNames } from "./theme";

type AITextBoxProps = {
  onSendMessage: (message: string) => void;
};

export default function AITextBox({ onSendMessage }: AITextBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  const canSend = value.trim().length > 0;

  // function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
  //   if (event.key === "Enter" && !event.shiftKey) {
  //     event.preventDefault();
  //     console.log("Message: ", value)
  //   }
  // }

  async function messageSend() {
    const message = value.trim();
    if (!message) return;

    onSendMessage(value);
    setValue("");


    const streamChat = await trpcClient.queryAI.query({ message: value })

    for await (const chunk of streamChat) {
      console.log("Chunk: ", chunk)
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full">
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
            className={cn(
              "min-h-[88px] w-full resize-none border-0 bg-transparent px-4 pt-4 pb-12 text-[13px] shadow-none focus-visible:border-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
              aiThemeClassNames.textPrimary,
              "placeholder:text-[#737373]",
            )}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2.5">
            <ModelPicker />
            <button
              type="button"
              onClick={() => messageSend()}
              disabled={!canSend}
              aria-label="Send message"
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full border transition-colors",
                aiThemeClassNames.border,
                aiThemeClassNames.surfaceHover,
                canSend
                  ? cn(aiThemeClassNames.textPrimary, "hover:bg-[#1a1a1a]")
                  : cn(aiThemeClassNames.textDisabled, "cursor-not-allowed opacity-60"),
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
