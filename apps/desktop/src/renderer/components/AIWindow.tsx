import { useMemo, useRef, useState, type CSSProperties } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  BotIcon,
  ChevronRightIcon,
  Clock3Icon,
  MessageSquareIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PlusIcon,
  SparklesIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";
import AITextBox from "./AIWindow/AITextBox";
import { trpc } from "../utils/trpc";
import { cn } from "@/lib/utils";

const isMac = navigator.platform.toUpperCase().includes("MAC");

type AIMessageRole = "assistant" | "user";

type AIMessage = {
  id: number;
  role: AIMessageRole;
  content: string;
  timestamp: Date;
  status?: "error";
};

export type AISession = {
  id: number;
  title: string;
  createdAt: Date;
  messages: AIMessage[];
};

function createSession(id: number): AISession {
  return {
    id,
    title: `New chat ${id}`,
    createdAt: new Date(),
    messages: [],
  };
}

function getPreview(session: AISession) {
  const lastMessage = session.messages.at(-1);
  if (!lastMessage) {
    return "Ready for a new task";
  }

  return lastMessage.content;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function makeMessageId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function getCodexReply(result: unknown): string | null {
  if (typeof result === "string" && result.trim().length > 0) {
    return result.trim();
  }

  if (result && typeof result === "object" && "finalResponse" in result) {
    const value = (result as { finalResponse?: unknown }).finalResponse;
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  if (result && typeof result === "object" && "items" in result) {
    const items = (result as { items?: unknown }).items;
    if (Array.isArray(items)) {
      const agentMessage = items.find((item): item is { text: string } => {
        return (
          item !== null &&
          typeof item === "object" &&
          "type" in item &&
          item.type === "agent_message" &&
          "text" in item &&
          typeof item.text === "string" &&
          item.text.trim().length > 0
        );
      });

      if (agentMessage) {
        return agentMessage.text.trim();
      }
    }
  }

  if (result && typeof result === "object" && "message" in result) {
    const value = (result as { message?: unknown }).message;
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

export function AIWindow() {
  const nextSessionId = useRef(2);
  const [sessions, setSessions] = useState<AISession[]>([createSession(1)]);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pendingSessionId, setPendingSessionId] = useState<number | null>(null);
  const sendChat = useMutation(trpc.sendChat.mutationOptions());

  const activeSession = useMemo(() => {
    return sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
  }, [activeSessionId, sessions]);

  function handleCreateSession() {
    const session = createSession(nextSessionId.current);
    nextSessionId.current += 1;
    setSessions((current) => [session, ...current]);
    setActiveSessionId(session.id);
  }

  function handleCloseSession(sessionId: number) {
    setSessions((current) => {
      const nextSessions = current.filter((session) => session.id !== sessionId);

      if (nextSessions.length === 0) {
        const session = createSession(nextSessionId.current);
        nextSessionId.current += 1;
        setActiveSessionId(session.id);
        return [session];
      }

      if (sessionId === activeSessionId) {
        setActiveSessionId(nextSessions[0].id);
      }

      return nextSessions;
    });
  }

  function updateSessionMessages(
    sessionId: number,
    getMessages: (session: AISession) => AIMessage[],
  ) {
    setSessions((current) =>
      current.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        const messages = getMessages(session);
        const firstUserMessage = messages.find((message) => message.role === "user");

        return {
          ...session,
          title: firstUserMessage
            ? firstUserMessage.content.slice(0, 42)
            : session.title,
          messages,
        };
      }),
    );
  }

  function handleSendMessage(message: string) {
    const sessionId = activeSession.id;
    const userMessage: AIMessage = {
      id: makeMessageId(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    updateSessionMessages(sessionId, (session) => [
      ...session.messages,
      userMessage,
    ]);
    setPendingSessionId(sessionId);

    sendChat.mutate(
      {
        message,
        user: "Raj",
      },
      {
        onSuccess: (result) => {
          const codexReply = getCodexReply(result);
          if (!codexReply) {
            const assistantMessage: AIMessage = {
              id: makeMessageId(),
              role: "assistant",
              content: "Codex finished without returning a response.",
              timestamp: new Date(),
              status: "error",
            };
            updateSessionMessages(sessionId, (session) => [
              ...session.messages,
              assistantMessage,
            ]);
            setPendingSessionId(null);
            return;
          }

          const assistantMessage: AIMessage = {
            id: makeMessageId(),
            role: "assistant",
            content: codexReply,
            timestamp: new Date(),
          };
          updateSessionMessages(sessionId, (session) => [
            ...session.messages,
            assistantMessage,
          ]);
          setPendingSessionId(null);
        },
        onError: (error) => {
          const assistantMessage: AIMessage = {
            id: makeMessageId(),
            role: "assistant",
            content:
              error instanceof Error
                ? error.message
                : "Codex could not finish this prompt.",
            timestamp: new Date(),
            status: "error",
          };
          updateSessionMessages(sessionId, (session) => [
            ...session.messages,
            assistantMessage,
          ]);
          setPendingSessionId(null);
        },
      },
    );
  }

  return (
    <main className="ai-window-root" style={styles.root}>
      {isMac ? <header style={styles.topBar} /> : null}
      <section
        className={cn(
          "ai-window-body",
          isSidebarCollapsed && "ai-window-body-sidebar-collapsed",
        )}
      >
        <aside
          className={cn(
            "ai-window-sidebar",
            isSidebarCollapsed && "ai-window-sidebar-collapsed",
          )}
          aria-label="AI conversations"
        >
          <div className="ai-window-sidebar-header">
            <div className="ai-window-brand">
              <SparklesIcon className="size-4" aria-hidden />
              <span>Codex</span>
            </div>
            <button
              type="button"
              className="ai-window-icon-btn"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setIsSidebarCollapsed((current) => !current)}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpenIcon className="size-4" />
              ) : (
                <PanelLeftCloseIcon className="size-4" />
              )}
            </button>
          </div>

          <button
            type="button"
            className="ai-window-new-chat"
            onClick={handleCreateSession}
            title="New chat"
          >
            <PlusIcon className="size-4" aria-hidden />
            <span>New chat</span>
          </button>

          <nav className="ai-window-thread-list" aria-label="Threads">
            {sessions.map((session) => {
              const isActive = session.id === activeSession.id;
              const isPending = pendingSessionId === session.id;

              return (
                <div
                  className={cn(
                    "ai-window-thread-row",
                    isActive && "ai-window-thread-row-active",
                  )}
                  key={session.id}
                >
                  <button
                    type="button"
                    className="ai-window-thread-button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    <MessageSquareIcon className="size-4" aria-hidden />
                    <span className="ai-window-thread-copy">
                      <span className="ai-window-thread-title">{session.title}</span>
                      <span className="ai-window-thread-preview">
                        {isPending ? "Codex is thinking" : getPreview(session)}
                      </span>
                    </span>
                    <ChevronRightIcon className="ai-window-thread-chevron size-4" />
                  </button>
                  <button
                    type="button"
                    className="ai-window-thread-more"
                    aria-label={`Close ${session.title}`}
                    onClick={() => handleCloseSession(session.id)}
                  >
                    <XIcon className="size-3" />
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="ai-window-sidebar-footer">
            <Clock3Icon className="size-4" aria-hidden />
            <span>Local AI window</span>
          </div>
        </aside>

        <section className="ai-window-chat" aria-label="AI chat">
          <header className="ai-window-chat-header">
            <div>
              <p className="ai-window-chat-kicker">AI Window</p>
              <h1>{activeSession.title}</h1>
            </div>
            <div className="ai-window-chat-meta">
              <BotIcon className="size-4" aria-hidden />
              <span>{pendingSessionId === activeSession.id ? "Running" : "Ready"}</span>
            </div>
          </header>

          <div className="ai-window-messages" role="log" aria-live="polite">
            {activeSession.messages.length === 0 ? (
              <div className="ai-window-empty-state">
                <div className="ai-window-empty-icon">
                  <SparklesIcon className="size-5" aria-hidden />
                </div>
                <h2>What should we work on?</h2>
                <p>
                  This thread is ready for a prompt, question, or code task.
                </p>
              </div>
            ) : (
              activeSession.messages.map((message) => (
                <article
                  className={cn(
                    "ai-window-message",
                    message.role === "user" && "ai-window-message-user",
                    message.status === "error" && "ai-window-message-error",
                  )}
                  key={message.id}
                >
                  <div className="ai-window-message-avatar" aria-hidden>
                    {message.role === "user" ? (
                      <UserRoundIcon className="size-4" />
                    ) : (
                      <BotIcon className="size-4" />
                    )}
                  </div>
                  <div className="ai-window-message-content">
                    <div className="ai-window-message-header">
                      <span>{message.role === "user" ? "You" : "Codex"}</span>
                      <time>{formatTime(message.timestamp)}</time>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </article>
              ))
            )}

            {pendingSessionId === activeSession.id ? (
              <article className="ai-window-message ai-window-message-loading">
                <div className="ai-window-message-avatar" aria-hidden>
                  <BotIcon className="size-4" />
                </div>
                <div className="ai-window-message-content">
                  <div className="ai-window-message-header">
                    <span>Codex</span>
                    <time>Now</time>
                  </div>
                  <div className="ai-window-typing" aria-label="Codex is thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </article>
            ) : null}
          </div>

          <footer className="ai-window-composer">
            <AITextBox
              isSending={sendChat.isPending}
              onSubmit={handleSendMessage}
            />
          </footer>
        </section>
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
    fontSize: 13,
  },
  topBar: {
    height: 38,
    flexShrink: 0,
    background: "var(--editor-surface)",
    borderBottom: "1px solid #2b2b2b",
    // @ts-expect-error -- Electron-specific CSS for draggable title bar
    WebkitAppRegion: "drag",
  },
};
