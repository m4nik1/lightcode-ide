import type { RemoteControlConnectionStatus } from "./RemoteControlConnectionStatus.js";
/**
 * Current remote-control connection status and remote identity exposed to clients.
 */
export type RemoteControlStatusChangedNotification = {
    status: RemoteControlConnectionStatus;
    serverName: string;
    installationId: string;
    environmentId: string | null;
};
//# sourceMappingURL=RemoteControlStatusChangedNotification.d.ts.map