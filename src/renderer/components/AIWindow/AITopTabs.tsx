import type { CSSProperties } from "react";

const noDrag = {
  WebkitAppRegion: "no-drag",
} as CSSProperties;

function SessionIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      style={styles.tabIcon}
    >
      <rect
        x="2.5"
        y="2.5"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 6L11.5 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AITopTabs() {
  return (
    <div style={styles.strip}>
      <div style={styles.tab} role="tab" aria-selected>
        <SessionIcon />
        <span style={styles.label}>New session</span>
        <span
          role="button"
          aria-label="Close New session"
          style={styles.closeBtn}
          tabIndex={-1}
        >
          ×
        </span>
      </div>
      <div style={styles.fill} />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  strip: {
    display: "flex",
    alignItems: "center",
    height: 32,
    flexShrink: 0,
    paddingLeft: 8,
    paddingRight: 8,
    background: "#000000",
    borderBottom: "1px solid #1a1a1a",
    overflow: "hidden",
  },
  tab: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 24,
    paddingLeft: 8,
    paddingRight: 6,
    borderRadius: 6,
    background: "#2a2a2a",
    color: "#b8b8b8",
    fontSize: 12,
    fontFamily: "inherit",
    userSelect: "none",
    whiteSpace: "nowrap",
    flexShrink: 0,
    ...noDrag,
  },
  tabIcon: {
    flexShrink: 0,
    color: "#9a9a9a",
  },
  label: {
    lineHeight: 1,
  },
  closeBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 18,
    height: 18,
    marginLeft: 2,
    borderRadius: 4,
    color: "#9a9a9a",
    fontSize: 14,
    lineHeight: 1,
    cursor: "default",
    flexShrink: 0,
  },
  fill: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    background: "#000000",
  },
};
