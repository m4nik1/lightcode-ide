import type { GuardianApprovalReviewStatus } from "./GuardianApprovalReviewStatus.js";
import type { GuardianRiskLevel } from "./GuardianRiskLevel.js";
import type { GuardianUserAuthorization } from "./GuardianUserAuthorization.js";
/**
 * [UNSTABLE] Temporary approval auto-review payload used by
 * `item/autoApprovalReview/*` notifications. This shape is expected to change
 * soon.
 */
export type GuardianApprovalReview = {
    status: GuardianApprovalReviewStatus;
    riskLevel: GuardianRiskLevel | null;
    userAuthorization: GuardianUserAuthorization | null;
    rationale: string | null;
};
//# sourceMappingURL=GuardianApprovalReview.d.ts.map