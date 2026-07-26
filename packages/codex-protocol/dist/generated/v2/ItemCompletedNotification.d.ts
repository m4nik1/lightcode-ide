import type { ThreadItem } from "./ThreadItem.js";
export type ItemCompletedNotification = {
    item: ThreadItem;
    threadId: string;
    turnId: string;
    /**
     * Unix timestamp (in milliseconds) when this item lifecycle completed.
     */
    completedAtMs: number;
};
//# sourceMappingURL=ItemCompletedNotification.d.ts.map