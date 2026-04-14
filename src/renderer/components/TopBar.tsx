import { CSSProperties, useState } from "react"

export default function TopBar() {
  const [fileDropDown, setFileDropDown] = useState(false);

  function openFile() {
    window.electronAPI.openFile()
  }

  return (
      <header style={styles.bar}>
        <button 
          className="topbar-trigger" 
          style={styles.item} 
          aria-expanded={fileDropDown} 
          onClick={() => setFileDropDown(!fileDropDown)} 
          type="button"
        >
          File
        </button>

        { fileDropDown ? 
          <div role="menu" style={styles.menu}>
            <button className="topbar-menu-item" onClick={() => openFile()} role="menuItem" type="button">
              Open File
            </button>
          </div> : null }
      </header>
  )
}

const styles : Record<string, CSSProperties> = {
  bar: {
    height: 30,
    display: "flex",
    alignItems: "center",
    paddingInline: 8,
    background: "var(--editor-surface)",
    borderBottom: "1px solid #2b2b2b",
  },
  item: {
    height: 22,
    padding: "0 8px",
    border: 0,
    background: "transparent",
    color: "#cccccc",
    fontSize: 12,
    borderRadius: 4,
    cursor: "default",
    // @ts-expect-error -- Electron-specific CSS for interactive controls
    WebkitAppRegion: "no-drag",
  },
  menuRoot: {
    position: "relative",
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
  },
  separator: {
    height: 1,
    background: "#3c3c3c",
    margin: "4px 0",
  },
}