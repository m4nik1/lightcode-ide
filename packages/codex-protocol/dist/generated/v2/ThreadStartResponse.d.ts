import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
import type { ReasoningEffort } from "../ReasoningEffort.js";
import type { ApprovalsReviewer } from "./ApprovalsReviewer.js";
import type { AskForApproval } from "./AskForApproval.js";
import type { SandboxPolicy } from "./SandboxPolicy.js";
import type { Thread } from "./Thread.js";
export type ThreadStartResponse = {
    thread: Thread;
    model: string;
    modelProvider: string;
    serviceTier: string | null;
    cwd: AbsolutePathBuf; /**
     * Instruction source files currently loaded for this thread.
     */
    instructionSources: Array<AbsolutePathBuf>;
    approvalPolicy: AskForApproval; /**
     * Reviewer currently used for approval requests on this thread.
     */
    approvalsReviewer: ApprovalsReviewer; /**
     * Legacy sandbox policy retained for compatibility. Experimental clients
     * should prefer `activePermissionProfile` for profile provenance.
     */
    sandbox: SandboxPolicy;
    reasoningEffort: ReasoningEffort | null;
};
//# sourceMappingURL=ThreadStartResponse.d.ts.map