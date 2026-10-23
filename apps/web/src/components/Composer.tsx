import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SquareIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import ModelPicker, { ToolbarDivider } from "./ModelPicker";
import AccessPicker from "./AccessPicker";
import SendArrowIcon from "./icons/SendArrowIcon";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";
import { useAIChat } from "../context/useAIChat";
import { useFileSearch } from "../context/useFileSearch";
import type { FileSearchResult } from "@/utils/trpc";
import FileMentionMenu, { entryPath } from "./FileMentionMenu";
import { useThreads } from "@/context/useThreads";
import { useChatSession } from "@/context/useChatSession";

export default function Composer() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState(false);
  const [activeIndex, setIndex] = useState(0);

  // Hooks and context
  const { isTurning, stopTurn } = useAIChat();
  const { currentThread } = useThreads();
  const { sendQuery } = useChatSession();
  const { setQuery, setCurrentProjectPath, searchResults } = useFileSearch();

  useEffect(() => {
    setIndex((currentIndex) =>
      currentIndex >= searchResults.length ? 0 : currentIndex,
    );
  }, [searchResults.length]);

  const canSend = value.trim().length > 0;
  const actionButtonThemeClassName = isTurning
    ? aiThemeClassNames.stopAction
    : canSend
      ? aiThemeClassNames.accentAction
      : aiThemeClassNames.accentActionDisabled;

  function handleSend() {
    if (isTurning) {
      stopTurn();
    } else {
      if (!canSend) return;
      void sendQuery(value, "build");
    }
    setValue("");
  }

  function handleFileSelect(entry: FileSearchResult) {
    const cursorPosition = textareaRef.current?.selectionStart ?? value.length;
    const mentionStart = value.lastIndexOf("@", cursorPosition - 1);
    const replacementStart =
      mentionStart === -1 ? cursorPosition : mentionStart;
    const mention = `@${entryPath(entry)} `;
    const nextCursorPosition = replacementStart + mention.length;

    setValue(
      value.slice(0, replacementStart) + mention + value.slice(cursorPosition),
    );
    setSearch(false);
    setQuery("");
    setIndex(0);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      );
    });
  }

  function onValueChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);

    // When search is active, get the search query starting from special character
    if (search) {
      const cursorPosition = e.target.selectionStart;
      const mentionStart = e.target.value.lastIndexOf("@", cursorPosition - 1);
      setQuery(
        mentionStart === -1
          ? ""
          : e.target.value.slice(mentionStart + 1, cursorPosition),
      );
      setCurrentProjectPath(currentThread?.projectPath ?? "");
    } else {
      setQuery("");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // These events handle the file menu navigation
    if (search) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        // Navigate the index for the fileMentionMenu
        setIndex((currentIndex) => Math.max(0, currentIndex - 1));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setIndex((currentIndex) =>
          Math.min(Math.max(searchResults.length - 1, 0), currentIndex + 1),
        );
      }
      // If the key pressed is escape quits the search
      else if (event.key == "Escape") {
        setSearch(false);
      } else if (event.key == "Enter") {
        event.preventDefault();
        const selectedEntry = searchResults[activeIndex];
        if (selectedEntry) {
          handleFileSelect(selectedEntry);
        }
      } else if (event.key == " ") {
        setSearch(false);
      }
    }
    if (event.key === "Enter" && !event.shiftKey && !search) {
      event.preventDefault();
      handleSend();
    }

    // If the @ key is pressed then make search active
    if (event.key == "@" && !search) {
      setIndex(0);
      setSearch(true);
    }
  }

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-4xl">
      {search ? (
        <FileMentionMenu
          currentIndex={activeIndex}
          onSelect={handleFileSelect}
        />
      ) : null}
      <div className="composer-surface">
        <div className="composer-glass" aria-hidden="true" />
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onValueChange(e);
          }}
          aria-label="Message"
          placeholder="Ask for changes or send follow-ups"
          rows={3}
          onKeyDown={(e) => handleKeyDown(e)}
          className={cn(
            "chat-messages-scrollbar min-h-24 max-h-64 resize-none rounded-none border-0 bg-transparent px-5 pt-5 pb-3 text-base leading-6 shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent",
            aiThemeClassNames.textPrimary,
            aiThemeClassNames.placeholder,
          )}
        />
        <div className="flex items-end gap-3 px-3 pb-3 pt-1">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-y-1">
            <ModelPicker />
            <ToolbarDivider />
            <AccessPicker />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!isTurning && !canSend}
            aria-label={isTurning ? "Stop response" : "Send message"}
            title={isTurning ? "Stop response" : "Send message (Enter)"}
            className={cn(
              "inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] focus-visible:outline-none focus-visible:ring-2",
              aiThemeClassNames.focusRing,
              actionButtonThemeClassName,
            )}
          >
            {isTurning ? (
              <SquareIcon className="size-3.5" fill="currentColor" aria-hidden="true" />
            ) : (
              <SendArrowIcon className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
