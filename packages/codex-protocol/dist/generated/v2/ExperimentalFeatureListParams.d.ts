export type ExperimentalFeatureListParams = {
    /**
     * Opaque pagination cursor returned by a previous call.
     */
    cursor?: string | null;
    /**
     * Optional page size; defaults to a reasonable server-side value.
     */
    limit?: number | null;
    /**
     * Optional loaded thread id. Pass this when showing feature state for an
     * existing thread so enablement is computed from that thread's refreshed
     * config, including project-local config for the thread's cwd.
     */
    threadId?: string | null;
};
//# sourceMappingURL=ExperimentalFeatureListParams.d.ts.map