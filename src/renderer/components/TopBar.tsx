import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const isMac = navigator.platform.toUpperCase().includes("MAC");
const ctrlKey = isMac ? "Cmd" : "Ctrl";

type MenuItem =
  | { kind: "action"; label: string; shortcut: string; onSelect: () => void }
  | { kind: "separator" };

const fileMenuItems: MenuItem[] = [
  {
    kind: "action",
    label: "Open File",
    shortcut: `${ctrlKey}+O`,
    onSelect: () => {
      // TODO: Open a native file picker and load the selected file into the editor.
    },
  },
  {
    kind: "action",
    label: "Open Folder",
    shortcut: `${ctrlKey}+K ${ctrlKey}+O`,
    onSelect: () => {
      // TODO: Open a native folder picker and load the selected workspace.
    },
  },
  { kind: "separator" },
  {
    kind: "action",
    label: "Save",
    shortcut: `${ctrlKey}+S`,
    onSelect: () => {
      // TODO: Save the active file to its current path.
    },
  },
  {
    kind: "action",
    label: "Save As",
    shortcut: `${ctrlKey}+Shift+S`,
    onSelect: () => {
      // TODO: Prompt for a destination path and save the active file there.
    },
  },
];

export default function TopBar() {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsFileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} style={styles.topBar}>
      <div style={styles.menuGroup}>
        <button
          type="button"
          className="topbar-trigger"
          style={styles.menuTrigger}
          onClick={() => setIsFileMenuOpen((current) => !current)}
          aria-expanded={isFileMenuOpen}
          aria-haspopup="menu"
        >
          File
        </button>

        {isFileMenuOpen ? (
          <div style={styles.dropdown} role="menu" aria-label="File actions">
            {fileMenuItems.map((item, index) =>
              item.kind === "separator" ? (
                <div key={`sep-${index}`} style={styles.separator} />
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className="topbar-menu-item"
                  style={styles.menuItem}
                  role="menuitem"
                  onClick={() => {
                    item.onSelect();
                    setIsFileMenuOpen(false);
                  }}
                >
                  <span>{item.label}</span>
                  <span style={styles.shortcut}>{item.shortcut}</span>
                </button>
              ),
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  topBar: {
    height: 30,
    display: "flex",
    alignItems: "center",
    padding: "0 4px",
    borderBottom: "1px solid #2b2b2b",
    background: "#1e1e1e",
    position: "relative",
    zIndex: 10,
    fontSize: 13,
    // @ts-expect-error -- Electron-specific CSS for draggable title bar
    WebkitAppRegion: "drag",
  },
  menuGroup: {
    position: "relative",
    // @ts-expect-error -- keep buttons clickable inside the drag region
    WebkitAppRegion: "no-drag",
  },
  menuTrigger: {
    border: "none",
    borderRadius: 3,
    background: "transparent",
    color: "#cccccc",
    padding: "3px 8px",
    fontSize: 13,
    cursor: "pointer",
    outline: "none",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    minWidth: 220,
    padding: "4px 0",
    borderRadius: 5,
    border: "1px solid #454545",
    background: "#252526",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
    display: "grid",
    gap: 0,
  },
  separator: {
    height: 1,
    background: "#454545",
    margin: "4px 0",
  },
  menuItem: {
    border: "none",
    borderRadius: 0,
    background: "transparent",
    color: "#cccccc",
    padding: "6px 20px 6px 8px",
    fontSize: 13,
    textAlign: "left",
    cursor: "pointer",
    outline: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
  },
  shortcut: {
    color: "#a0a0a0",
    fontSize: 12,
    marginLeft: "auto",
    whiteSpace: "nowrap",
  },
};
