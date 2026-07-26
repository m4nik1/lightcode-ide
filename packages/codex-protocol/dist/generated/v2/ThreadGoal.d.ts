import type { ThreadGoalStatus } from "./ThreadGoalStatus.js";
export type ThreadGoal = {
    threadId: string;
    objective: string;
    status: ThreadGoalStatus;
    tokenBudget: number | null;
    tokensUsed: number;
    timeUsedSeconds: number;
    createdAt: number;
    updatedAt: number;
};
//# sourceMappingURL=ThreadGoal.d.ts.map