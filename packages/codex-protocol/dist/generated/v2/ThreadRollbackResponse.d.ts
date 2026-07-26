import type { Thread } from "./Thread.js";
export type ThreadRollbackResponse = {
    /**
     * The updated thread after applying the rollback, with `turns` populated.
     *
     * The ThreadItems stored in each Turn are lossy since we explicitly do not
     * persist all agent interactions, such as command executions. This is the same
     * behavior as `thread/resume`.
     */
    thread: Thread;
};
//# sourceMappingURL=ThreadRollbackResponse.d.ts.map