import { CSSProperties, FocusEvent, useEffect, useRef, useState } from "react";
import { useEditorTabs } from "../context/EditorTabsContext";

const isMac = navigator.platform.toUpperCase().includes("MAC");

export default function NativeTopBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [fileDropDown, setFileDropDown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openFile, openFolder } = useEditorTabs();

  function openAIWindow() {
    void window.electronAPI.openAIWindow();
  }

  useEffect(() => {
    if (isMac) {
      return;
    }

    window.electronAPI.isWindowMaximized().then(setIsMaximized);
  }, []);

  async function readOpenFile() {
    // Send the selected path up so App can share it with the editor.
    const file = await window.electronAPI.openFile();
    const filePath = file.filePaths[0];

    if (!filePath) {
      return;
    }

    // Sends to call back file is open
    openFile(filePath);
    setFileDropDown(false);
  }

  async function toggleMaximize() {
    const maximized = await window.electronAPI.toggleMaximizeWindow();
    setIsMaximized(maximized);
  }

  function closeDropdownOnBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFileDropDown(false);
    }
  }

  return (
    <header style={styles.bar}>
      <div style={styles.leftGroup}>
        <div ref={menuRef} style={styles.menuArea} onBlur={closeDropdownOnBlur}>
          <button
            className="topbar-trigger"
            style={styles.menuTrigger}
            aria-expanded={fileDropDown}
            aria-haspopup="menu"
            onClick={() => setFileDropDown(!fileDropDown)}
            type="button"
          >
            File
          </button>

          {fileDropDown ? (
            <div role="menu" style={styles.menu}>
              <button className="topbar-menu-item" onClick={() => readOpenFile()} role="menuitem" type="button">
                Open File
              </button>
              <button
                className="topbar-menu-item"
                onClick={() => {
                  openFolder();
                  setFileDropDown(false);
                }}
                role="menuitem"
                type="button"
              >
                Open Folder
              </button>
            </div>
          ) : null}
        </div>

        {!isMac ? (
          <button className="ai-window-btn" style={styles.aiWindowBtn} onClick={openAIWindow} type="button">
            AI window
          </button>
        ) : null}
      </div>

      {!isMac ? (
        <div style={styles.windowControls}>
          <button
            className="native-window-control"
            aria-label="Minimize"
            onClick={() => window.electronAPI.minimizeWindow()}
            type="button"
          >
            <span style={styles.minimizeIcon} />
          </button>

          <button
            className="native-window-control"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onClick={toggleMaximize}
            type="button"
          >
            {isMaximized ? <span style={styles.restoreIcon} /> : <span style={styles.maximizeIcon} />}
          </button>

          <button
            className="native-window-control native-window-control-close"
            aria-label="Close"
            onClick={() => window.electronAPI.closeWindow()}
            type="button"
          >
            <span style={styles.closeIcon}>×</span>
          </button>
        </div>
      ) : null}
    </header>
  );
}

const noDrag = {
  WebkitAppRegion: "no-drag",
} as CSSProperties;

const styles: Record<string, CSSProperties> = {
  bar: {
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 8,
    background: "var(--editor-surface)",
    borderBottom: "1px solid #2b2b2b",
    // @ts-expect-error -- Electron-specific CSS for draggable title bar
    WebkitAppRegion: "drag",
  },
  leftGroup: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  menuArea: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  menuTrigger: {
    height: 22,
    padding: "0 8px",
    border: 0,
    background: "transparent",
    color: "#cccccc",
    fontSize: 12,
    borderRadius: 4,
    cursor: "default",
    ...noDrag,
  },
  aiWindowBtn: {
    height: 22,
    padding: "0 10px",
    border: 0,
    background: "transparent",
    color: "#cccccc",
    fontSize: 12,
    borderRadius: 4,
    cursor: "pointer",
    ...noDrag,
  },
  menu: {
    position: "absolute",
    top: 26,
    left: 0,
    minWidth: 180,
    background: "#252526",
    border: "1px solid #3c3c3c",
    borderRadius: 6,
    padding: 4,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
    zIndex: 1000,
    ...noDrag,
  },
  windowControls: {
    display: "flex",
    alignItems: "stretch",
    height: "100%",
    ...noDrag,
  },
  minimizeIcon: {
    width: 10,
    height: 10,
    borderBottom: "1px solid currentColor",
  },
  maximizeIcon: {
    width: 10,
    height: 10,
    border: "1px solid currentColor",
  },
  restoreIcon: {
    width: 10,
    height: 10,
    border: "1px solid currentColor",
    boxShadow: "-3px 3px 0 -1px var(--editor-surface), -3px 3px 0 0 currentColor",
  },
  closeIcon: {
    width: 10,
    height: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    lineHeight: 1,
  },
};
