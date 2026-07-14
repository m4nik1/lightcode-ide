import type { CSSProperties } from "react";
import AISidebar from "./AIWindow/sidebar/AISidebar";
import AITextBox from "./AIWindow/AITextBox";
import ChatBubbles from "./AIWindow/ChatBubbles";
import { aiTheme } from "./AIWindow/theme";
import { AiChatProvider } from "@/context/useAIChat";

const isMac = navigator.platform.toUpperCase().includes("MAC");

export function AIWindow() {
  return (
    <main style={styles.root}>
      <div aria-hidden="true" style={styles.blurBackdrop} />
      <AiChatProvider>
        <div style={styles.sidebarLayer}>
          <AISidebar />
        </div>
        <div style={styles.mainColumn}>
          {isMac ? <header style={styles.topBar} /> : null}
          <section style={styles.content}>
            <ChatBubbles isAIResponse={false} />
            <div style={styles.composerArea}>
              <div style={styles.promptWrap}>
                <AITextBox />
              </div>
            </div>
          </section>
        </div>
      </AiChatProvider>
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
    background: "transparent",
    color: aiTheme.textPrimary,
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
    overflow: "hidden",
    isolation: "isolate",
  },
  blurBackdrop: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    background:
      "linear-gradient(135deg, rgba(82, 82, 82, 0.22), rgba(0, 0, 0, 0) 38%), linear-gradient(180deg, #101010 0%, #050505 100%)",
  },
  sidebarLayer: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    height: "100%",
    flexShrink: 0,
  },
  mainColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
    background: aiTheme.background,
    position: "relative",
    zIndex: 1,
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
