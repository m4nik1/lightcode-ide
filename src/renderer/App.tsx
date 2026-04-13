import type { CSSProperties } from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer";
import ModernEditor from "./components/ModernEditor";

const isMac = navigator.platform.toUpperCase().includes("MAC");
const macTopBarHeight = 37;
const sidebarWidth = 240;

export default function App() {
  return (
    <main style={styles.page}>
      {isMac ? <div aria-hidden="true" style={styles.macTopBar} /> : <TopBar />}
      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <FileExplorer />
        </aside>
        <div style={styles.sidebarBorder} />
        <section style={styles.editorShell}>
          <ModernEditor />
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
      ? `${macTopBarHeight}px minmax(0, 1fr)`
      : "30px minmax(0, 1fr)",
  },
  macTopBar: {
    background: "var(--editor-surface)",
    borderBottom: "1px solid #2b2b2b",
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
};
