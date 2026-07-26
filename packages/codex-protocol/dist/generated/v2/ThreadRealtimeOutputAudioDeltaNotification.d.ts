import type { ThreadRealtimeAudioChunk } from "./ThreadRealtimeAudioChunk.js";
/**
 * EXPERIMENTAL - streamed output audio emitted by thread realtime.
 */
export type ThreadRealtimeOutputAudioDeltaNotification = {
    threadId: string;
    audio: ThreadRealtimeAudioChunk;
};
//# sourceMappingURL=ThreadRealtimeOutputAudioDeltaNotification.d.ts.map