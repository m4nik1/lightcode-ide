import { useRef, type CSSProperties } from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer";
import ModernEditor from "./components/ModernEditor";
import NativeTopBar from "./components/NativeTopBar";
import TopTabs from "./components/TopTabs";
import { m4Editor } from "./editor/m4Editor";
import { useEditorTabs } from "./context/EditorTabsContext";

const isMac = navigator.platform.toUpperCase().includes("MAC");
const macTrafficLightRowHeight = 38;
const topBarHeight = 30;
const sidebarWidth = 240;

function openAIWindow() {
  console.log("Opening AI window");
}

export default function App() {
  const { activeFilePath } = useEditorTabs();

  const editorRef = useRef<m4Editor | null>(null);
  if (!editorRef.current) {
    editorRef.current = new m4Editor(null);
  }
  const editor = editorRef.current;

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
      {/* {!isMac ? <TopBar onOpenFile={setActiveFilePath} /> : null} */}
      <NativeTopBar />
      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <FileExplorer />
        </aside>
        <div style={styles.sidebarBorder} />
        <section style={styles.editorShell}>
          <TopTabs editor={editor} />
          <ModernEditor filePath={activeFilePath} editor={editor} />
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
      ? `${macTrafficLightRowHeight}px ${topBarHeight}px minmax(0, 1fr)`
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
    display: "grid",
    gridTemplateRows: "35px minmax(0, 1fr)",
    width: "100%",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
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
    // @ts-expect-error -- Electron-specific CSS so the button is clickable
    WebkitAppRegion: "no-drag",
  },
};
