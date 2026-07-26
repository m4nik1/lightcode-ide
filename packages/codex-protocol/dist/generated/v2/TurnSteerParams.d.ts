import type { UserInput } from "./UserInput.js";
export type TurnSteerParams = {
    threadId: string;
    clientUserMessageId?: string | null;
    input: Array<UserInput>; /**
     * Required active turn id precondition. The request fails when it does not
     * match the currently active turn.
     */
    expectedTurnId: string;
};
//# sourceMappingURL=TurnSteerParams.d.ts.map