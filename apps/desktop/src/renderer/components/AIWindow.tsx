import { useState, type CSSProperties } from "react";
import AISidebar from "./AIWindow/sidebar/AISidebar";
import type { AIProject } from "./AIWindow/sidebar/types";
import AITextBox from "./AIWindow/AITextBox";
import ChatBubbles, { type ChatMessage } from "./AIWindow/ChatBubbles";
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
];

export function AIWindow() {
  const [projects] = useState<AIProject[]>(mockProjects);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handleSendMessage(message: string) {
    const text = message.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), text },
    ]);
  }

  return (
    <main style={styles.root}>
      <AISidebar projects={projects} activeProjectId="2" activeThreadId="2-1" />
      <div style={styles.mainColumn}>
        {isMac ? <header style={styles.topBar} /> : null}
        <section style={styles.content}>
          <ChatBubbles messages={messages} />
          <div style={styles.composerArea}>
            <div style={styles.promptWrap}>
              <AITextBox onSendMessage={handleSendMessage} />
            </div>
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
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "0 24px 22px",
    minHeight: 0,
    position: "relative",
  },
  composerArea: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },
  promptWrap: {
    width: "100%",
    maxWidth: 1440,
  },
  statusRow: {
    width: "100%",
    maxWidth: 1360,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "14px 44px 0",
    color: aiTheme.textDisabled,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.25,
  },
  statusItem: {
    minWidth: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  statusLabel: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  statusIcon: {
    flexShrink: 0,
  },
};
