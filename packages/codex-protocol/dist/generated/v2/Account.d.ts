import type { PlanType } from "../PlanType.js";
export type Account = {
    "type": "apiKey";
} | {
    "type": "chatgpt";
    email: string;
    planType: PlanType;
} | {
    "type": "amazonBedrock";
};
//# sourceMappingURL=Account.d.ts.map