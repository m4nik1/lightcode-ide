import type { RealtimeConversationVersion } from "../RealtimeConversationVersion.js";
/**
 * EXPERIMENTAL - emitted when thread realtime startup is accepted.
 */
export type ThreadRealtimeStartedNotification = {
    threadId: string;
    realtimeSessionId: string | null;
    version: RealtimeConversationVersion;
};
//# sourceMappingURL=ThreadRealtimeStartedNotification.d.ts.map