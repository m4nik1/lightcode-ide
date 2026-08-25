import { type CSSProperties } from "react";
import AISidebar from "./components/sidebar/AISidebar";
import Composer from "./components/Composer";
import ChatMessages from "./components/ChatMessages";
import { aiTheme } from "./theme";
import { AiChatProvider, useAIChat } from "./context/useAIChat";
import { Folder } from "lucide-react";

function ChatTopBar() {
  const { currentThread } = useAIChat();
  const projectName = currentThread
    ? currentThread.projectPath.split(/[\\/]/).filter(Boolean).at(-1)
    : null;

  return (
    <header style={styles.topBar}>
      {currentThread ? (
        <div style={styles.breadcrumb}>
          <Folder aria-hidden="true" style={styles.folderIcon} />
          <span style={styles.projectName}>{projectName}</span>
          <span style={styles.separator}>/</span>
          <span style={styles.threadName}>{currentThread.title}</span>
        </div>
      ) : null}
    </header>
  );
}

export function AIWindow() {
  return (
    <main style={styles.root}>
      <div aria-hidden="true" style={styles.blurBackdrop} />
      <AiChatProvider>
        <div style={styles.sidebarLayer}>
          <AISidebar />
        </div>
        <div style={styles.mainColumn}>
          <ChatTopBar />
          <section style={styles.content}>
            <ChatMessages />
            <div style={styles.composerArea}>
              <div style={styles.promptWrap}>
                <Composer />
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
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
      `linear-gradient(135deg, ${aiTheme.surface} 0%, ${aiTheme.sidebar} 36%, ${aiTheme.background} 72%)`,
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
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    background: aiTheme.background,
    borderBottom: `1px solid ${aiTheme.border}`,
    // @ts-expect-error -- Electron-specific CSS for draggable title bar
    WebkitAppRegion: "drag",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
    width: "100%",
  },
  folderIcon: {
    width: 14,
    height: 14,
    flexShrink: 0,
    color: aiTheme.textMuted,
  },
  projectName: {
    maxWidth: "40%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: aiTheme.textMuted,
  },
  separator: {
    flexShrink: 0,
    color: aiTheme.textDisabled,
  },
  threadName: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: aiTheme.textPrimary,
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
