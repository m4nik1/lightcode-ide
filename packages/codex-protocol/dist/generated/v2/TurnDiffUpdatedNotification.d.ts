/**
 * Notification that the turn-level unified diff has changed.
 * Contains the latest aggregated diff across all file changes in the turn.
 */
export type TurnDiffUpdatedNotification = {
    threadId: string;
    turnId: string;
    diff: string;
};
//# sourceMappingURL=TurnDiffUpdatedNotification.d.ts.map