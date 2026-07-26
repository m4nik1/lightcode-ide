import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
import type { FileSystemSandboxEntry } from "./FileSystemSandboxEntry.js";
export type AdditionalFileSystemPermissions = {
    /**
     * This will be removed in favor of `entries`.
     */
    read: Array<AbsolutePathBuf> | null;
    /**
     * This will be removed in favor of `entries`.
     */
    write: Array<AbsolutePathBuf> | null;
    globScanMaxDepth?: number;
    entries?: Array<FileSystemSandboxEntry>;
};
//# sourceMappingURL=AdditionalFileSystemPermissions.d.ts.map