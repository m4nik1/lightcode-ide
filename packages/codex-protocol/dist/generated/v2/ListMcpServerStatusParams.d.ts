import type { McpServerStatusDetail } from "./McpServerStatusDetail.js";
export type ListMcpServerStatusParams = {
    /**
     * Opaque pagination cursor returned by a previous call.
     */
    cursor?: string | null;
    /**
     * Optional page size; defaults to a server-defined value.
     */
    limit?: number | null;
    /**
     * Controls how much MCP inventory data to fetch for each server.
     * Defaults to `Full` when omitted.
     */
    detail?: McpServerStatusDetail | null;
    threadId?: string | null;
};
//# sourceMappingURL=ListMcpServerStatusParams.d.ts.map