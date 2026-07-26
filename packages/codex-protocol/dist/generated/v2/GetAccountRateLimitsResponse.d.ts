import type { RateLimitSnapshot } from "./RateLimitSnapshot.js";
export type GetAccountRateLimitsResponse = {
    /**
     * Backward-compatible single-bucket view; mirrors the historical payload.
     */
    rateLimits: RateLimitSnapshot;
    /**
     * Multi-bucket view keyed by metered `limit_id` (for example, `codex`).
     */
    rateLimitsByLimitId: {
        [key in string]?: RateLimitSnapshot;
    } | null;
};
//# sourceMappingURL=GetAccountRateLimitsResponse.d.ts.map