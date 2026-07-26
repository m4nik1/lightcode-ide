import type { AccountTokenUsageDailyBucket } from "./AccountTokenUsageDailyBucket.js";
import type { AccountTokenUsageSummary } from "./AccountTokenUsageSummary.js";
export type GetAccountTokenUsageResponse = {
    summary: AccountTokenUsageSummary;
    dailyUsageBuckets: Array<AccountTokenUsageDailyBucket> | null;
};
//# sourceMappingURL=GetAccountTokenUsageResponse.d.ts.map