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
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
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
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M7.5 11.5V3.5M7.5 3.5L4.25 6.75M7.5 3.5L10.75 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
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

  const placeholder = "Ask me anything...";
  const selectedModel =
    AI_MODELS.find((model) => model.id === modelId) ?? AI_MODELS[0];
  const hasPrompt = value.trim().length > 0;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
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

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
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
          <div style={styles.modelWrap}>
            <button
              type="button"
              aria-label="Select AI model"
              aria-haspopup="listbox"
              aria-expanded={isPickerOpen}
              style={{
                ...styles.modelButton,
                ...(isPickerOpen ? styles.modelButtonActive : {}),
              }}
              onClick={() => setIsPickerOpen((open) => !open)}
            >
              <span
                style={{
                  ...styles.modelDot,
                  background: selectedModel.accent,
                }}
              />
              <span style={styles.modelLabel}>{selectedModel.label}</span>
              <ChevronDownIcon />
            </button>

            {isPickerOpen ? (
              <div style={styles.modelMenu} role="listbox" aria-label="AI models">
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
                            <span style={styles.modelDescription}>{model.description}</span>
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
          </div>

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
  );
}

const glassSurface = {
  background: "rgba(32, 32, 32, 0.72)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
} as CSSProperties;

const styles: Record<string, CSSProperties> = {
  root: {
    position: "relative",
    width: "100%",
  },
  composer: {
    position: "relative",
    overflow: "visible",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    ...glassSurface,
    boxShadow:
      "0 12px 32px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    transition: "border-color 140ms ease, box-shadow 140ms ease",
  },
  composerFocused: {
    borderColor: "rgba(255, 255, 255, 0.14)",
    boxShadow:
      "0 16px 40px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  },
  textarea: {
    display: "block",
    width: "100%",
    minHeight: 42,
    maxHeight: 180,
    resize: "none",
    border: 0,
    outline: 0,
    padding: "13px 14px 8px",
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
    padding: "0 6px 6px 6px",
  },
  modelWrap: {
    position: "relative",
    minWidth: 0,
  },
  modelButton: {
    height: 26,
    maxWidth: 200,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid transparent",
    borderRadius: 999,
    padding: "0 10px 0 8px",
    background: "transparent",
    color: "#c4c4c4",
    fontSize: 11,
    fontWeight: 500,
    cursor: "default",
    outline: "none",
    transition: "background 120ms ease, border-color 120ms ease, color 120ms ease",
  },
  modelButtonActive: {
    background: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
  },
  modelDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    flexShrink: 0,
  },
  modelLabel: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  modelMenu: {
    position: "absolute",
    left: 0,
    bottom: 32,
    width: 240,
    padding: 4,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    ...glassSurface,
    boxShadow:
      "0 16px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    zIndex: 20,
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
    borderRadius: 7,
    padding: 0,
    color: "#0f0f0f",
    outline: "none",
    transition: "background 120ms ease, color 120ms ease, opacity 120ms ease",
  },
  sendButtonReady: {
    background: "#f4f4f5",
    cursor: "default",
  },
  sendButtonHover: {
    background: "#ffffff",
  },
  sendButtonDisabled: {
    background: "#363636",
    color: "#838383",
    cursor: "default",
    opacity: 0.86,
  },
};
