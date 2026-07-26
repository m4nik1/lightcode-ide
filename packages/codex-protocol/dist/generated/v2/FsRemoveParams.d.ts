import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
/**
 * Remove a file or directory tree from the host filesystem.
 */
export type FsRemoveParams = {
    /**
     * Absolute path to remove.
     */
    path: AbsolutePathBuf;
    /**
     * Whether directory removal should recurse. Defaults to `true`.
     */
    recursive?: boolean | null;
    /**
     * Whether missing paths should be ignored. Defaults to `true`.
     */
    force?: boolean | null;
};
//# sourceMappingURL=FsRemoveParams.d.ts.map