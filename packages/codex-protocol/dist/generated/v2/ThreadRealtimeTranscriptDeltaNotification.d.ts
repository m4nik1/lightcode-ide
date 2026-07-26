/**
 * EXPERIMENTAL - flat transcript delta emitted whenever realtime
 * transcript text changes.
 */
export type ThreadRealtimeTranscriptDeltaNotification = {
    threadId: string;
    role: string;
    /**
     * Live transcript delta from the realtime event.
     */
    delta: string;
};
//# sourceMappingURL=ThreadRealtimeTranscriptDeltaNotification.d.ts.map