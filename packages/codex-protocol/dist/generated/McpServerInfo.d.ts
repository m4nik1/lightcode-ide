import type { JsonValue } from "./serde_json/JsonValue.js";
/**
 * Presentation metadata advertised by an initialized MCP server.
 */
export type McpServerInfo = {
    name: string;
    title: string | null;
    version: string;
    description: string | null;
    icons: Array<JsonValue> | null;
    websiteUrl: string | null;
};
//# sourceMappingURL=McpServerInfo.d.ts.map