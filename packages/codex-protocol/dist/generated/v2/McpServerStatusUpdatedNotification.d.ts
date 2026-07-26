import type { McpServerStartupState } from "./McpServerStartupState.js";
export type McpServerStatusUpdatedNotification = {
    threadId: string | null;
    name: string;
    status: McpServerStartupState;
    error: string | null;
};
//# sourceMappingURL=McpServerStatusUpdatedNotification.d.ts.map