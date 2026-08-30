import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpIcon, StopCircleIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import ModelPicker from "./ModelPicker";
import AccessPicker from "./AccessPicker";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";
import { useAIChat } from "../context/useAIChat";
import { useFileSearch } from "@/context/useFileSearch";
import FileMentionMenu from "./FileMentionMenu";

type CollaborationMode = "build" | "plan";

export default function Composer() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<CollaborationMode>("build");
  const [search, setSearch] = useState(false);
  const { messageSend, isTurning, stopTurn, currentThread } = useAIChat();
  const { query, setQuery, setCurrentProjectPath } = useFileSearch();

  const canSend = value.trim().length > 0;
  const actionButtonThemeClassName = isTurning
    ? aiThemeClassNames.stopAction
    : canSend
      ? aiThemeClassNames.primaryAction
      : aiThemeClassNames.primaryActionDisabled;

  function handleSend() {
    if (isTurning) {
      stopTurn();
    } else {
      void messageSend(value, mode);
    }
    setValue("");
  }

  function toggleMode() {
    setMode((current) => (current === "build" ? "plan" : "build"));
  }
  

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if(search) {
      console.log('event key: ', event.key)
      setQuery(query + event.key);
      setCurrentProjectPath(currentThread?.projectPath);
    }
    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
      toggleMode();
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key == "@" && !search) {
      console.log("Triggered fff file search");
      setSearch(true);
    }
  }

  return (
    <div className="relative mx-auto min-h-28 w-80 min-w-0 sm:w-[60%]">
      {search ? (
        <FileMentionMenu />
      ) : null}
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
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Ask for follow-up changes"
          rows={3}
          onKeyDown={(e) => handleKeyDown(e)}
          className={cn(
            "min-h-28  resize-none border-0 bg-transparent px-5 pt-5 pb-14 text-sm leading-6 shadow-none focus-visible:border-0 focus-visible:ring-0",
            aiThemeClassNames.textPrimary,
            aiThemeClassNames.placeholder,
          )}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-3.5">
          <div className="flex items-center gap-1">
            <AccessPicker />
            <button
              type="button"
              aria-label={`Mode: ${mode}`}
              aria-pressed={mode === "plan"}
              onClick={toggleMode}
              className={cn(
                "inline-flex h-7 items-center rounded-lg px-2 text-xs font-normal transition-[background-color,color,opacity] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                aiThemeClassNames.surfaceHover,
                mode === "plan"
                  ? aiThemeClassNames.textPrimary
                  : aiThemeClassNames.textMuted,
              )}
            >
              {mode === "plan" ? "Plan" : "Build"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ModelPicker />
            <button
              type="button"
              onClick={handleSend}
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
  );
}
