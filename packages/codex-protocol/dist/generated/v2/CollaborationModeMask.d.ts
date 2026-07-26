import type { ModeKind } from "../ModeKind.js";
import type { ReasoningEffort } from "../ReasoningEffort.js";
/**
 * EXPERIMENTAL - collaboration mode preset metadata for clients.
 */
export type CollaborationModeMask = {
    name: string;
    mode: ModeKind | null;
    model: string | null;
    reasoning_effort: ReasoningEffort | null | null;
};
//# sourceMappingURL=CollaborationModeMask.d.ts.map