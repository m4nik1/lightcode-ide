import { useState, type CSSProperties } from "react";
import { Select } from "@base-ui/react";

const modelOptions = [
  { label: "GPT-5.5", value: "gpt-5.5" },
  { label: "Claude Sonnet 4.6", value: "claude-sonnet-4.6" },
]

type ModelValue = (typeof modelOptions)[number]["value"];

export default function Dropdown() {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelValue>("gpt-5.5");

  return (
    <Select.Root
      items={modelOptions}
      value={selectedModel}
      onValueChange={(value) => {
        setSelectedModel(value as ModelValue);
      }}
    >
      <Select.Label style={styles.label}>AI model</Select.Label>
      <Select.Trigger
        style={{
          ...styles.trigger,
          ...(isHovered ? styles.triggerHover : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Select.Value style={styles.value} placeholder="GPT-5.5" />
        <ChevronDownIcon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          align="end"
          alignItemWithTrigger={false}
          side="top"
          sideOffset={6}
          style={styles.positioner}
        >
          <Select.Popup style={styles.popup}>
            <Select.List style={styles.list}>
              {modelOptions.map((option) => (
                <ModelOption
                  key={option.value}
                  label={option.label}
                  selected={option.value === selectedModel}
                  value={option.value}
                />
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function ModelOption({
  label,
  selected,
  value,
}: {
  label: string;
  selected: boolean;
  value: ModelValue;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Select.Item
      value={value}
      style={{
        ...styles.item,
        ...(selected ? styles.itemSelected : {}),
        ...(isHovered ? styles.itemHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Select.ItemText style={styles.itemText}>{label}</Select.ItemText>
      <Select.ItemIndicator style={styles.itemIndicator}>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="m5 7 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="m3 8 3 3 7-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styles: Record<string, CSSProperties> = {
  label: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  trigger: {
    height: 28,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    padding: "0 8px 0 10px",
    color: "#dedede",
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 6px 14px rgba(0, 0, 0, 0.18)",
    cursor: "default",
    outline: "none",
    fontFamily: "inherit",
    transition: "background 120ms ease, border-color 120ms ease",
  },
  triggerHover: {
    borderColor: "rgba(255, 255, 255, 0.08)",
    background: "#333333",
  },
  value: {
    color: "#dddddd",
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },
  positioner: {
    zIndex: 100,
  },
  popup: {
    width: 180,
    padding: 4,
    border: "1px solid #2d2d2d",
    borderRadius: 10,
    background: "#1a1a1a",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.28)",
    outline: "none",
  },
  list: {
    display: "grid",
    gap: 2,
    outline: "none",
  },
  item: {
    minHeight: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderRadius: 7,
    padding: "0 8px",
    // color: "#d4d4d4",
    cursor: "default",
    outline: "none",
  },
  itemHover: {
    background: "#2c2c2c",
  },
  itemSelected: {
    color: "#ffffff",
    background: "rgba(255, 255, 255, 0.08)",
  },
  itemText: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 12,
    lineHeight: 1.2,
  },
  itemIndicator: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};
