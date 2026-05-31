import type { CSSProperties } from "react";
import AITextBox from "./AIWindow/AITextBox";
import AITopTabs from "./AIWindow/AITopTabs";

const isMac = navigator.platform.toUpperCase().includes("MAC");

export function AIWindow() {
  return (
    <main style={styles.root}>
      {isMac ? <header style={styles.topBar} /> : null}
      <AITopTabs />
      <section style={styles.content}>
        <div style={styles.promptWrap}>
          <AITextBox />
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  root: {
    height: "100vh",
    margin: 0,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "var(--editor-surface)",
    color: "#cccccc",
    fontFamily: "system-ui, sans-serif",
  },
  topBar: {
    height: 38,
    flexShrink: 0,
    background: "var(--editor-surface)",
    borderBottom: "1px solid #2b2b2b",
    // @ts-expect-error -- Electron-specific CSS for draggable title bar
    WebkitAppRegion: "drag",
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
    minHeight: 0,
  },
  promptWrap: {
    width: "100%",
    maxWidth: 560,
  },
};
