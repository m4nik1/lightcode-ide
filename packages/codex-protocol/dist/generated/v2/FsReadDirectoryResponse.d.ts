import type { FsReadDirectoryEntry } from "./FsReadDirectoryEntry.js";
/**
 * Directory entries returned by `fs/readDirectory`.
 */
export type FsReadDirectoryResponse = {
    /**
     * Direct child entries in the requested directory.
     */
    entries: Array<FsReadDirectoryEntry>;
};
//# sourceMappingURL=FsReadDirectoryResponse.d.ts.map