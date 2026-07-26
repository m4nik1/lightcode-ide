/**
 * EXPERIMENTAL - list available apps/connectors.
 */
export type AppsListParams = {
    /**
     * Opaque pagination cursor returned by a previous call.
     */
    cursor?: string | null;
    /**
     * Optional page size; defaults to a reasonable server-side value.
     */
    limit?: number | null;
    /**
     * Optional thread id used to evaluate app feature gating from that thread's config.
     */
    threadId?: string | null;
    /**
     * When true, bypass app caches and fetch the latest data from sources.
     */
    forceRefetch?: boolean;
};
//# sourceMappingURL=AppsListParams.d.ts.map