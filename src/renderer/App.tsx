import type { CSSProperties } from "react";
import ModernEditor from "./components/ModernEditor";
import TopBar from "./components/TopBar";

const isMac = navigator.platform.toUpperCase().includes("MAC");
const macTopBarHeight = 52;

export default function App() {
  return (
    <main style={styles.page}>
      {isMac ? <div aria-hidden="true" style={styles.macTopBar} /> : <TopBar />}
      <section style={styles.editorShell}>
        <ModernEditor />
      </section>
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
    background: "#111827",
    borderBottom: "1px solid #2b2b2b",
    // @ts-expect-error -- Electron-specific CSS for draggable title bar
    WebkitAppRegion: "drag",
  },
  editorShell: {
    width: "100%",
    height: "100%",
    minHeight: 0,
  },
};
