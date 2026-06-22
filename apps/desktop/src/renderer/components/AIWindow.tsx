import { useState, type CSSProperties } from "react";
import AISidebar from "./AIWindow/sidebar/AISidebar";
import type { AIProject } from "./AIWindow/sidebar/types";
import AITextBox from "./AIWindow/AITextBox";
import { aiTheme } from "./AIWindow/theme";

const isMac = navigator.platform.toUpperCase().includes("MAC");

const mockProjects: AIProject[] = [
  {
    id: "1",
    name: "glm-5.2-demos",
    threads: [{ id: "1-1", title: "Demo setup guide" }],
  },
  {
    id: "2",
    name: "please build me a frontend for...",
    threads: [
      { id: "2-1", title: "Initial layout wireframe" },
      { id: "2-2", title: "Component structure" },
      { id: "2-3", title: "Styling pass" },
    ],
  },
  {
    id: "3",
    name: "minimax-m3",
    threads: [
      { id: "3-1", title: "Model comparison" },
      { id: "3-2", title: "Benchmark results" },
    ],
  },
  { id: "4", name: "qwen36-27b", threads: [] },
  { id: "5", name: "nex-n2-pro", threads: [] },
  { id: "6", name: "local.ai", threads: [] },
  { id: "7", name: "sero", threads: [] },
  { id: "8", name: "content", threads: [] },
  { id: "9", name: "writing", threads: [] },
  { id: "10", name: "reasoning", threads: [] },
  { id: "11", name: "plugins", threads: [] },
  { id: "12", name: "personal", threads: [] },
  { id: "13", name: "vllm-studio", threads: [] },
  { id: "14", name: "deepseek-flash-preview", threads: [] },
  { id: "15", name: "parchi", threads: [] },
];

export function AIWindow() {
  const [projects] = useState<AIProject[]>(mockProjects);

  return (
    <main style={styles.root}>
      <AISidebar
        projects={projects}
        activeProjectId="2"
        activeThreadId="2-1"
      />
      <div style={styles.mainColumn}>
        {isMac ? <header style={styles.topBar} /> : null}
        <section style={styles.content}>
          <div style={styles.promptWrap}>
            <AITextBox />
          </div>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  root: {
    height: "100vh",
    margin: 0,
    display: "flex",
    flexDirection: "row",
    boxSizing: "border-box",
    position: "relative",
    background: aiTheme.background,
    color: aiTheme.textPrimary,
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
    overflow: "hidden",
  },
  mainColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
    background: aiTheme.background,
  },
  topBar: {
    height: 38,
    flexShrink: 0,
    background: aiTheme.background,
    borderBottom: `1px solid ${aiTheme.border}`,
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
