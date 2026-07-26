import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
/**
 * Write a file on the host filesystem.
 */
export type FsWriteFileParams = {
    /**
     * Absolute path to write.
     */
    path: AbsolutePathBuf;
    /**
     * File contents encoded as base64.
     */
    dataBase64: string;
};
//# sourceMappingURL=FsWriteFileParams.d.ts.map