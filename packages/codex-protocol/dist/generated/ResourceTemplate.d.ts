import type { JsonValue } from "./serde_json/JsonValue.js";
/**
 * A template description for resources available on the server.
 */
export type ResourceTemplate = {
    annotations?: JsonValue;
    uriTemplate: string;
    name: string;
    title?: string;
    description?: string;
    mimeType?: string;
};
//# sourceMappingURL=ResourceTemplate.d.ts.map