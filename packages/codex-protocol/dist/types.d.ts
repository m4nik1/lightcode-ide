import type { ClientInfo } from "./generated/ClientInfo.js";
export type CodexAppServerClientOptions = {
    clientInfo: ClientInfo;
    codexPathOverride?: string;
    env?: Record<string, string>;
    requestTimeoutMs?: number;
    notificationBufferSize?: number;
    optOutNotificationMethods?: string[];
};
export type AppServerClientState = "disconnected" | "connecting" | "connected" | "closed";
//# sourceMappingURL=types.d.ts.map