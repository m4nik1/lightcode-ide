import type { CSSProperties } from "react";

export function AIWindow() {
  return (
    <main style={styles.root}>
      <h1 style={styles.title}>AI</h1>
      <p style={styles.body}>
        This window loads the same React bundle with{" "}
        <code style={styles.code}>?window=ai</code>.
      </p>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  root: {
    height: "100vh",
    margin: 0,
    padding: 24,
    boxSizing: "border-box",
    background: "var(--editor-surface)",
    color: "#cccccc",
    fontFamily: "system-ui, sans-serif",
  },
  title: { fontSize: 20, margin: "0 0 8px" },
  body: { fontSize: 14, margin: 0, lineHeight: 1.5 },
  code: { fontSize: 13 },
};
