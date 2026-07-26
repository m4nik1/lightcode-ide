import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
/**
 * Filesystem watch notification emitted for `fs/watch` subscribers.
 */
export type FsChangedNotification = {
    /**
     * Watch identifier previously provided to `fs/watch`.
     */
    watchId: string;
    /**
     * File or directory paths associated with this event.
     */
    changedPaths: Array<AbsolutePathBuf>;
};
//# sourceMappingURL=FsChangedNotification.d.ts.map