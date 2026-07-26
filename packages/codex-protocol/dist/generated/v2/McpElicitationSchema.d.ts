import type { McpElicitationObjectType } from "./McpElicitationObjectType.js";
import type { McpElicitationPrimitiveSchema } from "./McpElicitationPrimitiveSchema.js";
/**
 * Typed form schema for MCP `elicitation/create` requests.
 *
 * This matches the `requestedSchema` shape from the MCP 2025-11-25
 * `ElicitRequestFormParams` schema.
 */
export type McpElicitationSchema = {
    $schema?: string;
    type: McpElicitationObjectType;
    properties: {
        [key in string]?: McpElicitationPrimitiveSchema;
    };
    required?: Array<string>;
};
//# sourceMappingURL=McpElicitationSchema.d.ts.map