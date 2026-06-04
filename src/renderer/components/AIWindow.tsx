import { useMemo, useState, type CSSProperties } from "react";
import AITextBox, { DEFAULT_AI_MODEL_ID } from "./AIWindow/AITextBox";
import AITopTabs from "./AIWindow/AITopTabs";

const isMac = navigator.platform.toUpperCase().includes("MAC");

export type AISession = {
  id: number;
  title: string;
  modelId: string;
};

function createSession(id: number): AISession {
  return {
    id,
    title: id === 1 ? "New session" : `Session ${id}`,
    modelId: DEFAULT_AI_MODEL_ID,
  };
}

export function AIWindow() {
  const [nextSessionId, setNextSessionId] = useState(2);
  const [sessions, setSessions] = useState<AISession[]>([createSession(1)]);
  const [activeSessionId, setActiveSessionId] = useState(1);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? sessions[0],
    [activeSessionId, sessions],
  );

  function handleCreateSession() {
    const newSession = createSession(nextSessionId);

    setSessions((currentSessions) => [...currentSessions, newSession]);
    setActiveSessionId(newSession.id);
    setNextSessionId((id) => id + 1);
  }

  function handleCloseSession(sessionId: number) {
    const closingIndex = sessions.findIndex((session) => session.id === sessionId);

    if (closingIndex === -1) {
      return;
    }

    if (sessions.length === 1) {
      const resetSession = createSession(nextSessionId);
      setSessions([resetSession]);
      setActiveSessionId(resetSession.id);
      setNextSessionId((id) => id + 1);
      return;
    }

    const remainingSessions = sessions.filter((session) => session.id !== sessionId);

    setSessions(remainingSessions);

    if (sessionId === activeSessionId) {
      const nextIndex =
        closingIndex >= remainingSessions.length
          ? remainingSessions.length - 1
          : closingIndex;

      setActiveSessionId(remainingSessions[nextIndex].id);
    }
  }

  function handleModelChange(modelId: string) {
    if (!activeSession) {
      return;
    }

    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === activeSession.id ? { ...session, modelId } : session,
      ),
    );
  }

  return (
    <main style={styles.root}>
      {isMac ? <header style={styles.topBar} /> : null}
      <AITopTabs
        sessions={sessions}
        activeSessionId={activeSession?.id ?? activeSessionId}
        onSelectSession={setActiveSessionId}
        onCreateSession={handleCreateSession}
        onCloseSession={handleCloseSession}
      />
      <section style={styles.content}>
        <div style={styles.promptWrap}>
          <AITextBox
            modelId={activeSession?.modelId ?? DEFAULT_AI_MODEL_ID}
            onModelChange={handleModelChange}
          />
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
