import type { JsonValue } from "../serde_json/JsonValue.js";
export type DynamicToolSpec = {
    namespace?: string;
    name: string;
    description: string;
    inputSchema: JsonValue;
    deferLoading?: boolean;
};
//# sourceMappingURL=DynamicToolSpec.d.ts.map