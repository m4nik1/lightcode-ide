import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Dropdown from "../ui/dropdown/Dropdown";

export type AIModel = {
  id: string;
  label: string;
  description?: string;
  accent: string;
};


function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M14 2L7.25 8.75M14 2L9.5 14L7.25 8.75M14 2L2 6.5L7.25 8.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AITextBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [isSendHovered, setIsSendHovered] = useState(false);

  const placeholder = "Ask me anything...";
  const hasPrompt = value.trim().length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        containerRef.current != null &&
        !containerRef.current.contains(target)
      ) {
        setIsPickerOpen(false);
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPickerOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function resizeTextArea() {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }

  function submitPrompt() {
    if (!hasPrompt) {
      return;
    }

    setValue("");

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "42px";
      }
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitPrompt();
    }
  }

  return (
    <div ref={containerRef} style={styles.root}>
      <div
        style={{
          ...styles.composer,
          ...(isComposerFocused ? styles.composerFocused : {}),
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            requestAnimationFrame(resizeTextArea);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsComposerFocused(true)}
          onBlur={() => setIsComposerFocused(false)}
          placeholder={placeholder}
          rows={1}
          style={styles.textarea}
        />

        <div style={styles.footer}>
          <div style={styles.toolbarRight}>
            <div
              style={styles.actionsGroup}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <Dropdown />
              <button
                type="button"
                aria-label="Send prompt"
                disabled={!hasPrompt}
                style={{
                  ...styles.sendButton,
                  ...(hasPrompt ? styles.sendButtonReady : styles.sendButtonDisabled),
                  ...(hasPrompt && isSendHovered ? styles.sendButtonHover : {}),
                }}
                onClick={submitPrompt}
                onMouseEnter={() => setIsSendHovered(true)}
                onMouseLeave={() => setIsSendHovered(false)}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  root: {
    position: "relative",
    width: "100%",
  },
  composer: {
    position: "relative",
    overflow: "visible",
    border: "1px solid #2d2d2d",
    borderRadius: 12,
    background: "var(--editor-surface, #121212)",
    transition: "border-color 140ms ease",
  },
  composerFocused: {
    borderColor: "#3a3a3a",
  },
  textarea: {
    display: "block",
    width: "100%",
    minHeight: 42,
    maxHeight: 180,
    resize: "none",
    border: 0,
    outline: 0,
    padding: "14px 14px 6px",
    background: "transparent",
    color: "#f0f0f0",
    fontSize: 14,
    lineHeight: 1.45,
    fontFamily: "inherit",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 34,
    padding: "0 8px 8px",
  },
  toolbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  toolbarRight: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    flexShrink: 0,
  },
  actionsGroup: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  toolbarIconButton: {
    width: 28,
    height: 28,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    borderRadius: 6,
    padding: 0,
    background: "transparent",
    color: "#8a8a8a",
    outline: "none",
    cursor: "default",
    transition: "color 120ms ease",
  },
  modelButton: {
    height: 28,
    maxWidth: 200,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    border: 0,
    borderRadius: 4,
    padding: "0 4px",
    background: "transparent",
    color: "#9a9a9a",
    fontSize: 12,
    fontWeight: 400,
    cursor: "default",
    outline: "none",
    transition: "color 120ms ease",
  },
  modelButtonActive: {
    color: "#d4d4d4",
  },
  modelLabel: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  modelMenu: {
    position: "absolute",
    right: 0,
    bottom: "calc(100% + 6px)",
    width: 240,
    padding: 4,
    border: "1px solid #2d2d2d",
    borderRadius: 10,
    background: "#1a1a1a",
    zIndex: 100,
  },
  modelOption: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    border: 0,
    borderRadius: 6,
    padding: "6px 8px",
    background: "transparent",
    color: "#d4d4d4",
    textAlign: "left",
    cursor: "default",
    transition: "background 100ms ease, color 100ms ease",
  },
  modelOptionSelected: {
    background: "rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
  },
  modelOptionLeading: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  modelDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    flexShrink: 0,
  },
  modelOptionText: {
    minWidth: 0,
    display: "grid",
    gap: 1,
  },
  modelOptionLabel: {
    fontSize: 12,
    lineHeight: 1.2,
    fontWeight: 500,
  },
  modelDescription: {
    color: "#8a8a8a",
    fontSize: 10,
    lineHeight: 1.25,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  checkMark: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sendButton: {
    width: 28,
    height: 28,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    borderRadius: 6,
    padding: 0,
    background: "transparent",
    outline: "none",
    transition: "color 120ms ease",
  },
  sendButtonReady: {
    color: "black",
    backgroundColor: "white",
    cursor: "default",
  },
  sendButtonHover: {
    color: "#ffffff",
  },
  sendButtonDisabled: {
    color: "#5a5a5a",
    cursor: "default",
  },
};
