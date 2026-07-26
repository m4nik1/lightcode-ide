import type { ParsedCommand } from "./ParsedCommand.js";
import type { ThreadId } from "./ThreadId.js";
export type ExecCommandApprovalParams = {
    conversationId: ThreadId;
    /**
     * Use to correlate this with [codex_protocol::protocol::ExecCommandBeginEvent]
     * and [codex_protocol::protocol::ExecCommandEndEvent].
     */
    callId: string;
    /**
     * Identifier for this specific approval callback.
     */
    approvalId: string | null;
    command: Array<string>;
    cwd: string;
    reason: string | null;
    parsedCmd: Array<ParsedCommand>;
};
//# sourceMappingURL=ExecCommandApprovalParams.d.ts.map