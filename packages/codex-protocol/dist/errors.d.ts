import type { RequestId } from "./generated/RequestId.js";
export declare class AppServerError extends Error {
    readonly name: string;
}
export declare class AppServerStateError extends AppServerError {
    readonly name = "AppServerStateError";
}
export declare class AppServerProtocolError extends AppServerError {
    readonly payload?: unknown | undefined;
    readonly name = "AppServerProtocolError";
    constructor(message: string, payload?: unknown | undefined);
}
export declare class AppServerRpcError extends AppServerError {
    readonly method: string;
    readonly requestId: RequestId;
    readonly code: number;
    readonly data?: unknown | undefined;
    readonly name = "AppServerRpcError";
    constructor(method: string, requestId: RequestId, code: number, message: string, data?: unknown | undefined);
}
export declare class AppServerTimeoutError extends AppServerError {
    readonly method: string;
    readonly requestId: RequestId;
    readonly timeoutMs: number;
    readonly name = "AppServerTimeoutError";
    constructor(method: string, requestId: RequestId, timeoutMs: number);
}
export declare class AppServerProcessError extends AppServerError {
    readonly exitCode: number | null;
    readonly signal: string | null;
    readonly name = "AppServerProcessError";
    constructor(message: string, exitCode?: number | null, signal?: string | null, options?: ErrorOptions);
}
export declare class UnsupportedServerRequestError extends AppServerError {
    readonly method: string;
    readonly name = "UnsupportedServerRequestError";
    constructor(method: string);
}
export declare class ServerRequestRejectedError extends AppServerError {
    readonly method: string;
    readonly name = "ServerRequestRejectedError";
    constructor(method: string);
}
export declare class NotificationBufferOverflowError extends AppServerError {
    readonly capacity: number;
    readonly name = "NotificationBufferOverflowError";
    constructor(capacity: number);
}
//# sourceMappingURL=errors.d.ts.map