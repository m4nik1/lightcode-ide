import type { ExecPolicyAmendment } from "./ExecPolicyAmendment.js";
import type { NetworkPolicyAmendment } from "./NetworkPolicyAmendment.js";
/**
 * User's decision in response to an ExecApprovalRequest.
 */
export type ReviewDecision = "approved" | {
    "approved_execpolicy_amendment": {
        proposed_execpolicy_amendment: ExecPolicyAmendment;
    };
} | "approved_for_session" | {
    "network_policy_amendment": {
        network_policy_amendment: NetworkPolicyAmendment;
    };
} | "denied" | "timed_out" | "abort";
//# sourceMappingURL=ReviewDecision.d.ts.map