import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpIcon, StopCircleIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import ModelPicker from "./ModelPicker";
import AccessPicker from "./AccessPicker";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";
import { useAIChat } from "../context/useAIChat";

export default function AITextBox() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const { messageSend, isTurning, stopTurn } = useAIChat();

  const canSend = value.trim().length > 0;
  const actionButtonThemeClassName = isTurning
    ? aiThemeClassNames.stopAction
    : canSend
      ? aiThemeClassNames.primaryAction
      : aiThemeClassNames.primaryActionDisabled;

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
            "relative flex min-h-28 flex-col overflow-hidden rounded-[22px] border transition-[border-color,background-color,box-shadow]",
            aiThemeClassNames.raisedSurface,
            aiThemeClassNames.border,
            aiThemeClassNames.focusWithinBorder,
            aiThemeClassNames.focusWithinDepth,
          )}
        >
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask for follow-up changes"
            rows={3}
            onKeyDown={(e) => handleKeyDown(e)}
            className={cn(
              "min-h-28 w-full resize-none border-0 bg-transparent px-5 pt-5 pb-14 text-sm leading-6 shadow-none focus-visible:border-0 focus-visible:ring-0",
              aiThemeClassNames.textPrimary,
              aiThemeClassNames.placeholder,
            )}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-3.5">
            <AccessPicker />

            <div className="flex items-center gap-2">
              <ModelPicker />
              <button
                type="button"
                onClick={() => {
                  if (isTurning) {
                    stopTurn();
                  } else {
                    void messageSend(value);
                  }
                  setValue("");
                }}
                aria-label="Send message"
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-full transition-[background-color,color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2",
                  aiThemeClassNames.focusRing,
                  actionButtonThemeClassName,
                )}
              >
                {isTurning ? (
                  <StopCircleIcon className="size-[18px]" strokeWidth={2} />
                ) : (
                  <ArrowUpIcon className="size-[18px]" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
