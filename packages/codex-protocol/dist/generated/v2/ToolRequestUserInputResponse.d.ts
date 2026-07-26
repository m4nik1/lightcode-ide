import type { ToolRequestUserInputAnswer } from "./ToolRequestUserInputAnswer.js";
/**
 * EXPERIMENTAL. Response payload mapping question ids to answers.
 */
export type ToolRequestUserInputResponse = {
    answers: {
        [key in string]?: ToolRequestUserInputAnswer;
    };
};
//# sourceMappingURL=ToolRequestUserInputResponse.d.ts.map