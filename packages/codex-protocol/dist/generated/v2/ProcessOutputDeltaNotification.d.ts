import type { ProcessOutputStream } from "./ProcessOutputStream.js";
/**
 * Base64-encoded output chunk emitted for a streaming `process/spawn` request.
 */
export type ProcessOutputDeltaNotification = {
    /**
     * Client-supplied, connection-scoped `processHandle` from `process/spawn`.
     */
    processHandle: string;
    /**
     * Output stream this chunk belongs to.
     */
    stream: ProcessOutputStream;
    /**
     * Base64-encoded output bytes.
     */
    deltaBase64: string;
    /**
     * True on the final streamed chunk for this stream when output was
     * truncated by `outputBytesCap`.
     */
    capReached: boolean;
};
//# sourceMappingURL=ProcessOutputDeltaNotification.d.ts.map