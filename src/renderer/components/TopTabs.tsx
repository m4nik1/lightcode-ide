import { useState, type CSSProperties } from "react";

// ── Mock tabs for visual demonstration ──────────────────────────────
type Tab = {
  id: string;
  label: string;
  isModified: boolean;
};

const MOCK_TABS: Tab[] = [
  { id: "1", label: "index.tsx", isModified: false },
  { id: "2", label: "App.tsx", isModified: true },
  { id: "3", label: "TopTabs.tsx", isModified: false },
];

export default function TopTabs() {
  const [activeTabId, setActiveTabId] = useState<string>(MOCK_TABS[0].id);
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [hoveredCloseId, setHoveredCloseId] = useState<string | null>(null);

  // TODO: Implement tab selection — switch active editor model
  function handleSelectTab(_id: string) {
    setActiveTabId(_id);
  }

  // TODO: Implement tab close — dispose editor model & remove tab from state
  function handleCloseTab(_id: string) {
    // stub
  }

  // TODO: Implement context menu (right-click) — close others, close to the right, etc.
  function handleTabContextMenu(_e: React.MouseEvent, _id: string) {
    // stub
  }

  return (
    <div style={styles.strip}>
      {MOCK_TABS.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isHovered = tab.id === hoveredTabId;

        const tabStyle: CSSProperties = {
          ...styles.tab,
          ...(isActive ? styles.tabActive : {}),
          ...(!isActive && isHovered ? styles.tabHover : {}),
        };

        const showClose = isActive || isHovered;

        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            style={tabStyle}
            onClick={() => handleSelectTab(tab.id)}
            onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
            onMouseEnter={() => setHoveredTabId(tab.id)}
            onMouseLeave={() => {
              setHoveredTabId(null);
              setHoveredCloseId(null);
            }}
          >
            {/* Active indicator — thin coloured top border */}
            {isActive && <span style={styles.activeIndicator} />}

            <span style={styles.label}>
              {tab.label}
            </span>

            {/* Modified dot or close button */}
            {tab.isModified && !showClose ? (
              <span style={styles.modifiedDot} />
            ) : (
              <span
                role="button"
                aria-label={`Close ${tab.label}`}
                style={{
                  ...styles.closeBtn,
                  ...(hoveredCloseId === tab.id ? styles.closeBtnHover : {}),
                  opacity: showClose ? 1 : 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
                onMouseEnter={() => setHoveredCloseId(tab.id)}
                onMouseLeave={() => setHoveredCloseId(null)}
              >
                ×
              </span>
            )}

            {/* Right-side separator between inactive tabs */}
            {!isActive && <span style={styles.separator} />}
          </div>
        );
      })}

      {/* Empty fill area to the right of tabs */}
      <div style={styles.fill} />
    </div>
  );
}

// ── Styles (VS Code dark default theme) ─────────────────────────────
const styles: Record<string, CSSProperties> = {
  strip: {
    display: "flex",
    alignItems: "stretch",
    height: 35,
    background: "#252526",
    borderBottom: "1px solid #1e1e1e",
    overflow: "hidden",
    flexShrink: 0,
    // No padding/margin — flush with the TopBar above
  },

  tab: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: "100%",
    minWidth: 80,
    maxWidth: 200,
    padding: "0 10px",
    paddingRight: 6,
    background: "#2d2d2d",
    color: "#969696",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    borderRight: "1px solid #252526",
  },

  tabActive: {
    background: "#1e1e1e",
    color: "#ffffff",
  },

  tabHover: {
    background: "#2a2a2a",
    color: "#cccccc",
  },

  activeIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: "#007acc",
  },

  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
  },

  closeBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: 4,
    border: 0,
    background: "transparent",
    color: "#969696",
    fontSize: 16,
    lineHeight: 1,
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.1s, color 0.1s",
  },

  closeBtnHover: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
  },

  modifiedDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#cccccc",
    flexShrink: 0,
  },

  separator: {
    position: "absolute",
    right: 0,
    top: 8,
    bottom: 8,
    width: 1,
    background: "#3c3c3c",
  },

  fill: {
    flex: 1,
    background: "#252526",
  },
};
