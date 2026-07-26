import type { JsonValue } from "../serde_json/JsonValue.js";
import type { MergeStrategy } from "./MergeStrategy.js";
export type ConfigValueWriteParams = {
    keyPath: string;
    value: JsonValue;
    mergeStrategy: MergeStrategy;
    /**
     * Path to the config file to write; defaults to the user's `config.toml` when omitted.
     */
    filePath?: string | null;
    expectedVersion?: string | null;
};
//# sourceMappingURL=ConfigValueWriteParams.d.ts.map