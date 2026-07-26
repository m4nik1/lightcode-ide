import type { ExternalAgentConfigMigrationItemType } from "./ExternalAgentConfigMigrationItemType.js";
import type { MigrationDetails } from "./MigrationDetails.js";
export type ExternalAgentConfigMigrationItem = {
    itemType: ExternalAgentConfigMigrationItemType;
    description: string;
    /**
     * Null or empty means home-scoped migration; non-empty means repo-scoped migration.
     */
    cwd: string | null;
    details: MigrationDetails | null;
};
//# sourceMappingURL=ExternalAgentConfigMigrationItem.d.ts.map