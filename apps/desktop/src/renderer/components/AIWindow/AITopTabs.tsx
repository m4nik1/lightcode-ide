import {
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

type AISessionTab = {
  id: number;
  title: string;
};

type AITopTabsProps = {
  sessions: AISessionTab[];
  activeSessionId: number;
  onSelectSession: (sessionId: number) => void;
  onCreateSession: () => void;
  onCloseSession: (sessionId: number) => void;
};

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

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 3V11M3 7H11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M4.25 4.25L9.75 9.75M9.75 4.25L4.25 9.75"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AITopTabs({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onCloseSession,
}: AITopTabsProps) {
  const [hoveredTabId, setHoveredTabId] = useState<number | null>(null);
  const [hoveredCloseId, setHoveredCloseId] = useState<number | null>(null);
  const [isAddHovered, setIsAddHovered] = useState(false);

  function handleClose(event: MouseEvent<HTMLButtonElement>, sessionId: number) {
    event.stopPropagation();
    onCloseSession(sessionId);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>, sessionId: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectSession(sessionId);
    }
  }

  return (
    <div style={styles.strip}>
      <div style={styles.tabList} role="tablist" aria-label="AI sessions">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const isHovered = session.id === hoveredTabId;
          const showClose = isActive || isHovered;

          return (
            <div
              key={session.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              style={{
                ...styles.tab,
                ...(isActive ? styles.tabActive : {}),
                ...(!isActive && isHovered ? styles.tabHover : {}),
              }}
              onClick={() => onSelectSession(session.id)}
              onKeyDown={(event) => handleTabKeyDown(event, session.id)}
              onMouseEnter={() => setHoveredTabId(session.id)}
              onMouseLeave={() => {
                setHoveredTabId(null);
                setHoveredCloseId(null);
              }}
            >
              <SessionIcon />
              <span style={styles.label}>{session.title}</span>
              <button
                type="button"
                aria-label={`Close ${session.title}`}
                style={{
                  ...styles.closeBtn,
                  ...(hoveredCloseId === session.id ? styles.closeBtnHover : {}),
                  opacity: showClose ? 1 : 0,
                }}
                onClick={(event) => handleClose(event, session.id)}
                onMouseEnter={() => setHoveredCloseId(session.id)}
                onMouseLeave={() => setHoveredCloseId(null)}
                tabIndex={showClose ? 0 : -1}
              >
                <CloseIcon />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          aria-label="New AI session"
          title="New session"
          style={{
            ...styles.addBtn,
            ...(isAddHovered ? styles.addBtnHover : {}),
          }}
          onClick={onCreateSession}
          onMouseEnter={() => setIsAddHovered(true)}
          onMouseLeave={() => setIsAddHovered(false)}
        >
          <PlusIcon />
        </button>
      </div>
      <div style={styles.fill} />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  strip: {
    display: "flex",
    alignItems: "center",
    height: 34,
    flexShrink: 0,
    paddingLeft: 8,
    paddingRight: 8,
    background: "#181818",
    borderBottom: "1px solid #2b2b2b",
    overflow: "hidden",
    // @ts-expect-error -- Electron-specific CSS for draggable title bar
    WebkitAppRegion: "drag",
  },
  tabList: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    minWidth: 0,
    height: "100%",
  },
  tab: {
    border: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 26,
    minWidth: 104,
    maxWidth: 180,
    paddingLeft: 8,
    paddingRight: 6,
    borderRadius: 6,
    background: "transparent",
    color: "#a8a8a8",
    fontSize: 12,
    fontFamily: "inherit",
    cursor: "default",
    userSelect: "none",
    whiteSpace: "nowrap",
    flexShrink: 0,
    transition: "background 120ms ease, color 120ms ease",
    ...noDrag,
  },
  tabActive: {
    background: "#2a2a2a",
    color: "#f1f1f1",
  },
  tabHover: {
    background: "#232323",
    color: "#d4d4d4",
  },
  tabIcon: {
    flexShrink: 0,
    color: "#9a9a9a",
  },
  label: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
  },
  closeBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    marginLeft: "auto",
    border: 0,
    borderRadius: 4,
    background: "transparent",
    color: "#9a9a9a",
    cursor: "default",
    flexShrink: 0,
    padding: 0,
    transition: "background 120ms ease, color 120ms ease, opacity 120ms ease",
    ...noDrag,
  },
  closeBtnHover: {
    background: "rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
  },
  addBtn: {
    width: 26,
    height: 26,
    border: 0,
    borderRadius: 6,
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: "#8f8f8f",
    cursor: "default",
    transition: "background 120ms ease, color 120ms ease",
    flexShrink: 0,
    ...noDrag,
  },
  addBtnHover: {
    background: "#232323",
    color: "#ffffff",
  },
  fill: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    background: "#181818",
  },
};
