import type { JsonValue } from "./serde_json/JsonValue.js";
/**
 * A known resource that the server is capable of reading.
 */
export type Resource = {
    annotations?: JsonValue;
    description?: string;
    mimeType?: string;
    name: string;
    size?: number;
    title?: string;
    uri: string;
    icons?: Array<JsonValue>;
    _meta?: JsonValue;
};
//# sourceMappingURL=Resource.d.ts.map