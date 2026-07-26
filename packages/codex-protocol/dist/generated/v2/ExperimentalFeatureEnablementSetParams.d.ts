export type ExperimentalFeatureEnablementSetParams = {
    /**
     * Process-wide runtime feature enablement keyed by canonical feature name.
     *
     * Only named features are updated. Omitted features are left unchanged.
     * Send an empty map for a no-op.
     */
    enablement: {
        [key in string]?: boolean;
    };
};
//# sourceMappingURL=ExperimentalFeatureEnablementSetParams.d.ts.map