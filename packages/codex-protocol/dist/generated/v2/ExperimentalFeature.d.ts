import type { ExperimentalFeatureStage } from "./ExperimentalFeatureStage.js";
export type ExperimentalFeature = {
    /**
     * Stable key used in config.toml and CLI flag toggles.
     */
    name: string;
    /**
     * Lifecycle stage of this feature flag.
     */
    stage: ExperimentalFeatureStage;
    /**
     * User-facing display name shown in the experimental features UI.
     * Null when this feature is not in beta.
     */
    displayName: string | null;
    /**
     * Short summary describing what the feature does.
     * Null when this feature is not in beta.
     */
    description: string | null;
    /**
     * Announcement copy shown to users when the feature is introduced.
     * Null when this feature is not in beta.
     */
    announcement: string | null;
    /**
     * Whether this feature is currently enabled in the loaded config.
     */
    enabled: boolean;
    /**
     * Whether this feature is enabled by default.
     */
    defaultEnabled: boolean;
};
//# sourceMappingURL=ExperimentalFeature.d.ts.map