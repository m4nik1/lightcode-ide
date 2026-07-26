import type { ConfigEdit } from "./ConfigEdit.js";
export type ConfigBatchWriteParams = {
    edits: Array<ConfigEdit>;
    /**
     * Path to the config file to write; defaults to the user's `config.toml` when omitted.
     */
    filePath?: string | null;
    expectedVersion?: string | null;
    /**
     * When true, hot-reload the updated user config into all loaded threads after writing.
     */
    reloadUserConfig?: boolean;
};
//# sourceMappingURL=ConfigBatchWriteParams.d.ts.map