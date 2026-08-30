import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpIcon, StopCircleIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import ModelPicker from "./ModelPicker";
import AccessPicker from "./AccessPicker";
import FileMentionMenu, {
  entryPath,
  filterWorkspaceFiles,
  type WorkspaceEntry,
} from "./FileMentionMenu";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";
import { useAIChat } from "../context/useAIChat";
import { trpcClient } from "@/utils/trpc";

type CollaborationMode = "build" | "plan";

type Mention = { start: number; query: string };

function detectMention(text: string, caret: number): Mention | null {
  const start = text.lastIndexOf("@", caret - 1);

  if (start === -1) return null;
  if (start > 0 && !/\s/.test(text[start - 1])) return null;

  const query = text.slice(start + 1, caret);

  if (/[\s@]/.test(query)) return null;

  return { start, query };
}

export default function Composer() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<CollaborationMode>("build");
  const [mention, setMention] = useState<Mention | null>(null);
  const [search, setSearch] = useState(false);
  const { messageSend, isTurning, stopTurn } = useAIChat();

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

  function syncMention(textarea: HTMLTextAreaElement) {
    setMention(detectMention(textarea.value, textarea.selectionStart ?? 0));
  }

  // Inserts the file mention
  // TODO: Do some research of how AI agents like see these mentions
  function insertMention(entry: WorkspaceEntry) {
    const textarea = textareaRef.current;
    if (!mention || !textarea) return;

    const caret = textarea.selectionStart ?? value.length;
    const insertion = `@${entryPath(entry)} `;
    const nextCaret = mention.start + insertion.length;

    setValue(value.slice(0, mention.start) + insertion + value.slice(caret));
    setMention(null);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCaret, nextCaret);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
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
        <FileMentionMenu
          entries={matches}
          onSelect={insertMention}
        />
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
            syncMention(e.target);
          }}
          placeholder="Ask for follow-up changes"
          rows={3}
          onKeyDown={(e) => handleKeyDown(e)}
          onSelect={(e) => syncMention(e.currentTarget)}
          onBlur={() => setMention(null)}
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
