import type { Turn } from "./Turn.js";
export type ReviewStartResponse = {
    turn: Turn;
    /**
     * Identifies the thread where the review runs.
     *
     * For inline reviews, this is the original thread id.
     * For detached reviews, this is the id of the new review thread.
     */
    reviewThreadId: string;
};
//# sourceMappingURL=ReviewStartResponse.d.ts.map