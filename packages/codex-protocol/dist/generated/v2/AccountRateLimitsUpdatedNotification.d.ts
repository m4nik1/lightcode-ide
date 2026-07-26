import type { RateLimitSnapshot } from "./RateLimitSnapshot.js";
/**
 * Sparse rolling rate-limit update.
 *
 * Clients should merge available values into the most recent `account/rateLimits/read` response
 * or refetch that snapshot. Nullable account metadata may be unavailable in a rolling update and
 * does not clear a previously observed value.
 */
export type AccountRateLimitsUpdatedNotification = {
    rateLimits: RateLimitSnapshot;
};
//# sourceMappingURL=AccountRateLimitsUpdatedNotification.d.ts.map