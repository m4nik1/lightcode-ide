/**
 * EXPERIMENTAL - proposed plan streaming deltas for plan items. Clients should
 * not assume concatenated deltas match the completed plan item content.
 */
export type PlanDeltaNotification = {
    threadId: string;
    turnId: string;
    itemId: string;
    delta: string;
};
//# sourceMappingURL=PlanDeltaNotification.d.ts.map