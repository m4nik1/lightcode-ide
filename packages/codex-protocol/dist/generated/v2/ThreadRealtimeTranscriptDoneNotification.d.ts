/**
 * EXPERIMENTAL - final transcript text emitted when realtime completes
 * a transcript part.
 */
export type ThreadRealtimeTranscriptDoneNotification = {
    threadId: string;
    role: string;
    /**
     * Final complete text for the transcript part.
     */
    text: string;
};
//# sourceMappingURL=ThreadRealtimeTranscriptDoneNotification.d.ts.map