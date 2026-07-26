import type { AbsolutePathBuf } from "../AbsolutePathBuf.js";
import type { HookEventName } from "./HookEventName.js";
import type { HookHandlerType } from "./HookHandlerType.js";
import type { HookSource } from "./HookSource.js";
import type { HookTrustStatus } from "./HookTrustStatus.js";
export type HookMetadata = {
    key: string;
    eventName: HookEventName;
    handlerType: HookHandlerType;
    matcher: string | null;
    command: string | null;
    timeoutSec: bigint;
    statusMessage: string | null;
    sourcePath: AbsolutePathBuf;
    source: HookSource;
    pluginId: string | null;
    displayOrder: bigint;
    enabled: boolean;
    isManaged: boolean;
    currentHash: string;
    trustStatus: HookTrustStatus;
};
//# sourceMappingURL=HookMetadata.d.ts.map