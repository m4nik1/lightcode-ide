import type { GrantedPermissionProfile } from "./GrantedPermissionProfile.js";
import type { PermissionGrantScope } from "./PermissionGrantScope.js";
export type PermissionsRequestApprovalResponse = {
    permissions: GrantedPermissionProfile;
    scope: PermissionGrantScope;
    /**
     * Review every subsequent command in this turn before normal sandboxed execution.
     */
    strictAutoReview?: boolean;
};
//# sourceMappingURL=PermissionsRequestApprovalResponse.d.ts.map