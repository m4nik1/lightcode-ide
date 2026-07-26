import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
/**
 * Start filesystem watch notifications for an absolute path.
 */
export type FsWatchParams = {
    /**
     * Connection-scoped watch identifier used for `fs/unwatch` and `fs/changed`.
     */
    watchId: string;
    /**
     * Absolute file or directory path to watch.
     */
    path: AbsolutePathBuf;
};
//# sourceMappingURL=FsWatchParams.d.ts.map