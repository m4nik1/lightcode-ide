import type { ToolRequestUserInputQuestion } from "./ToolRequestUserInputQuestion.js";
/**
 * EXPERIMENTAL. Params sent with a request_user_input event.
 */
export type ToolRequestUserInputParams = {
    threadId: string;
    turnId: string;
    itemId: string;
    questions: Array<ToolRequestUserInputQuestion>;
    autoResolutionMs: number | null;
};
//# sourceMappingURL=ToolRequestUserInputParams.d.ts.map