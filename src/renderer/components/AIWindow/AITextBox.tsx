import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

export type AIModel = {
  id: string;
  label: string;
  description?: string;
  accent: string;
};

type AITextBoxProps = {
  modelId: string;
  onModelChange: (modelId: string) => void;
};

export const AI_MODELS: AIModel[] = [
  {
    id: "auto",
    label: "Auto",
    description: "Pick the best model for the prompt",
    accent: "#a3a3a3",
  },
  {
    id: "claude-4-5-sonnet",
    label: "Claude 4.5 Sonnet",
    description: "Balanced coding and reasoning",
    accent: "#d97757",
  },
  {
    id: "claude-4-1-opus",
    label: "Claude 4.1 Opus",
    description: "Deepest reasoning for hard tasks",
    accent: "#c4a484",
  },
  {
    id: "gpt-5",
    label: "GPT-5",
    description: "Capable general-purpose model",
    accent: "#74aa9c",
  },
  {
    id: "gpt-5-codex",
    label: "GPT-5 Codex",
    description: "Optimized for code edits",
    accent: "#10a37f",
  },
  {
    id: "gemini-2-5-pro",
    label: "Gemini 2.5 Pro",
    description: "Long-context multimodal",
    accent: "#8ab4f8",
  },
  {
    id: "o3",
    label: "o3",
    description: "Strong step-by-step reasoning",
    accent: "#7dd3fc",
  },
  {
    id: "grok-4",
    label: "Grok 4",
    description: "Fast, capable alternative",
    accent: "#e5e5e5",
  },
];

export const DEFAULT_AI_MODEL_ID = AI_MODELS[0].id;

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 3.5V12.5M3.5 8H12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.75 8H13.25M8 2.75C6.2 4.6 5.25 6.2 5.25 8C5.25 9.8 6.2 11.4 8 13.25C9.8 11.4 10.75 9.8 10.75 8C10.75 6.2 9.8 4.6 8 2.75Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5.5 5L2.5 8L5.5 11M10.5 5L13.5 8L10.5 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7.1L5.75 9.75L11 4.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AITextBox({ modelId, onModelChange }: AITextBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [isSendHovered, setIsSendHovered] = useState(false);
  const [isModelHovered, setIsModelHovered] = useState(false);
  const [hoveredToolbarIcon, setHoveredToolbarIcon] = useState<string | null>(
    null,
  );

  const placeholder = "Ask me anything...";
  const selectedModel =
    AI_MODELS.find((model) => model.id === modelId) ?? AI_MODELS[0];
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

  function handleModelSelect(model: AIModel) {
    onModelChange(model.id);
    setIsPickerOpen(false);
    textareaRef.current?.focus();
  }

  function toolbarIconStyle(iconId: string): CSSProperties {
    return {
      ...styles.toolbarIconButton,
      color:
        hoveredToolbarIcon === iconId ? "#c4c4c4" : styles.toolbarIconButton.color,
    };
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
          <div style={styles.toolbarLeft}>
            <button
              type="button"
              aria-label="Add attachment"
              style={toolbarIconStyle("plus")}
              onMouseEnter={() => setHoveredToolbarIcon("plus")}
              onMouseLeave={() => setHoveredToolbarIcon(null)}
            >
              <PlusIcon />
            </button>
            <button
              type="button"
              aria-label="Web search"
              style={toolbarIconStyle("globe")}
              onMouseEnter={() => setHoveredToolbarIcon("globe")}
              onMouseLeave={() => setHoveredToolbarIcon(null)}
            >
              <GlobeIcon />
            </button>
            <button
              type="button"
              aria-label="Code mode"
              style={toolbarIconStyle("code")}
              onMouseEnter={() => setHoveredToolbarIcon("code")}
              onMouseLeave={() => setHoveredToolbarIcon(null)}
            >
              <CodeIcon />
            </button>
          </div>

          <div style={styles.toolbarRight}>
            <div
              style={styles.actionsGroup}
              onMouseDown={(event) => event.stopPropagation()}
            >
              {isPickerOpen ? (
                <div
                  style={styles.modelMenu}
                  role="listbox"
                  aria-label="AI models"
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  {AI_MODELS.map((model) => {
                    const isSelected = model.id === selectedModel.id;

                    return (
                      <button
                        key={model.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        style={{
                          ...styles.modelOption,
                          ...(isSelected ? styles.modelOptionSelected : {}),
                        }}
                        onClick={() => handleModelSelect(model)}
                      >
                        <span style={styles.modelOptionLeading}>
                          <span
                            style={{
                              ...styles.modelDot,
                              background: model.accent,
                            }}
                          />
                          <span style={styles.modelOptionText}>
                            <span style={styles.modelOptionLabel}>{model.label}</span>
                            {model.description ? (
                              <span style={styles.modelDescription}>
                                {model.description}
                              </span>
                            ) : null}
                          </span>
                        </span>
                        {isSelected ? (
                          <span
                            style={{
                              ...styles.checkMark,
                              color: model.accent,
                            }}
                          >
                            <CheckIcon />
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <button
                type="button"
                aria-label="Select AI model"
                aria-haspopup="listbox"
                aria-expanded={isPickerOpen}
                style={{
                  ...styles.modelButton,
                  ...(isPickerOpen || isModelHovered ? styles.modelButtonActive : {}),
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsPickerOpen((open) => !open);
                }}
                onMouseEnter={() => setIsModelHovered(true)}
                onMouseLeave={() => setIsModelHovered(false)}
              >
                <span style={styles.modelLabel}>{selectedModel.label}</span>
                <ChevronDownIcon />
              </button>

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
    color: "#d4d4d4",
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
