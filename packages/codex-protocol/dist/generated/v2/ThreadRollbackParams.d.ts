export type ThreadRollbackParams = {
    threadId: string;
    /**
     * The number of turns to drop from the end of the thread. Must be >= 1.
     *
     * This only modifies the thread's history and does not revert local file changes
     * that have been made by the agent. Clients are responsible for reverting these changes.
     */
    numTurns: number;
};
//# sourceMappingURL=ThreadRollbackParams.d.ts.map