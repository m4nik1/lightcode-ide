import type { ToolRequestUserInputOption } from "./ToolRequestUserInputOption.js";
/**
 * EXPERIMENTAL. Represents one request_user_input question and its required options.
 */
export type ToolRequestUserInputQuestion = {
    id: string;
    header: string;
    question: string;
    isOther: boolean;
    isSecret: boolean;
    options: Array<ToolRequestUserInputOption> | null;
};
//# sourceMappingURL=ToolRequestUserInputQuestion.d.ts.map