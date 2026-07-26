import type { AdditionalFileSystemPermissions } from "./AdditionalFileSystemPermissions.js";
import type { AdditionalNetworkPermissions } from "./AdditionalNetworkPermissions.js";
export type AdditionalPermissionProfile = {
    /**
     * Partial overlay used for per-command permission requests.
     */
    network: AdditionalNetworkPermissions | null;
    fileSystem: AdditionalFileSystemPermissions | null;
};
//# sourceMappingURL=AdditionalPermissionProfile.d.ts.map