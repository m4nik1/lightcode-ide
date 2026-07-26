import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
import type { RequestPermissionProfile } from "./RequestPermissionProfile.js";
export type PermissionsRequestApprovalParams = {
    threadId: string;
    turnId: string;
    itemId: string;
    environmentId: string | null;
    /**
     * Unix timestamp (in milliseconds) when this approval request started.
     */
    startedAtMs: number;
    cwd: AbsolutePathBuf;
    reason: string | null;
    permissions: RequestPermissionProfile;
};
//# sourceMappingURL=PermissionsRequestApprovalParams.d.ts.map