import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
import type { OverriddenMetadata } from "./OverriddenMetadata.js";
import type { WriteStatus } from "./WriteStatus.js";
export type ConfigWriteResponse = {
    status: WriteStatus;
    version: string;
    /**
     * Canonical path to the config file that was written.
     */
    filePath: AbsolutePathBuf;
    overriddenMetadata: OverriddenMetadata | null;
};
//# sourceMappingURL=ConfigWriteResponse.d.ts.map