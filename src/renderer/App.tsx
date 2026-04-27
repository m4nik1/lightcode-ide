import { useState, type CSSProperties } from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer";
import ModernEditor from "./components/ModernEditor";
import TopBar from "./components/TopBar";
import TopTabs from "./components/TopTabs";

const isMac = navigator.platform.toUpperCase().includes("MAC");
const macTrafficLightRowHeight = 38;
const topBarHeight = 30;
const tabBarHeight = 35;
const sidebarWidth = 240;

function openAIWindow() {
  console.log("Opening AI window");
}

export default function App() {
  // Keep the selected path in App so both the menu and editor can share it.
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);

  return (
    <main style={styles.page}>
      {isMac && (
        <div style={styles.macTrafficLightRow}>
          <button
            className="ai-window-btn"
            style={styles.aiWindowBtn}
            onClick={openAIWindow}
            type="button"
          >
            AI window
          </button>
        </div>
      )}
      {!isMac ? <TopBar onOpenFile={setActiveFilePath} /> : null}
      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <FileExplorer />
        </aside>
        <div style={styles.sidebarBorder} />
        <section style={styles.editorShell}>
          <TopTabs />
          <ModernEditor filePath={activeFilePath} />
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    height: "100vh",
    display: "grid",
    gridTemplateRows: isMac
      ? `${macTrafficLightRowHeight}px minmax(0, 1fr)`
      : `${topBarHeight}px minmax(0, 1fr)`,
  },
  macTrafficLightRow: {
    background: "var(--editor-surface)",
    borderBottom: "1px solid #2b2b2b",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 12,
    // @ts-expect-error -- Electron-specific CSS for draggable title bar
    WebkitAppRegion: "drag",
  },
  body: {
    display: "grid",
    gridTemplateColumns: `${sidebarWidth}px 1px minmax(0, 1fr)`,
    minHeight: 0,
    height: "100%",
  },
  sidebar: {
    height: "100%",
    overflow: "hidden",
  },
  sidebarBorder: {
    background: "#2b2b2b",
  },
  editorShell: {
    width: "100%",
    height: "100%",
    minHeight: 0,
  },
  aiWindowBtn: {
    height: 22,
    padding: "0 10px",
    border: 0,
    background: "transparent",
    color: "#cccccc",
    fontSize: 12,
    borderRadius: 4,
    cursor: "default",
    // @ts-expect-error -- Electron-specific CSS so the button is clickable
    WebkitAppRegion: "no-drag",
  },
};
