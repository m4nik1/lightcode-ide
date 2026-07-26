import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
/**
 * Copy a file or directory tree on the host filesystem.
 */
export type FsCopyParams = {
    /**
     * Absolute source path.
     */
    sourcePath: AbsolutePathBuf;
    /**
     * Absolute destination path.
     */
    destinationPath: AbsolutePathBuf;
    /**
     * Required for directory copies; ignored for file copies.
     */
    recursive?: boolean;
};
//# sourceMappingURL=FsCopyParams.d.ts.map