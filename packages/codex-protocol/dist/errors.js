export class AppServerError extends Error {
    name = "AppServerError";
}
export class AppServerStateError extends AppServerError {
    name = "AppServerStateError";
}
export class AppServerProtocolError extends AppServerError {
    payload;
    name = "AppServerProtocolError";
    constructor(message, payload) {
        super(message);
        this.payload = payload;
    }
}
export class AppServerRpcError extends AppServerError {
    method;
    requestId;
    code;
    data;
    name = "AppServerRpcError";
    constructor(method, requestId, code, message, data) {
        super(`${method} failed (${code}): ${message}`);
        this.method = method;
        this.requestId = requestId;
        this.code = code;
        this.data = data;
    }
}
export class AppServerTimeoutError extends AppServerError {
    method;
    requestId;
    timeoutMs;
    name = "AppServerTimeoutError";
    constructor(method, requestId, timeoutMs) {
        super(`${method} timed out after ${timeoutMs}ms`);
        this.method = method;
        this.requestId = requestId;
        this.timeoutMs = timeoutMs;
    }
}
export class AppServerProcessError extends AppServerError {
    exitCode;
    signal;
    name = "AppServerProcessError";
    constructor(message, exitCode = null, signal = null, options) {
        super(message, options);
        this.exitCode = exitCode;
        this.signal = signal;
    }
}
export class UnsupportedServerRequestError extends AppServerError {
    method;
    name = "UnsupportedServerRequestError";
    constructor(method) {
        super(`Unsupported app-server request: ${method}`);
        this.method = method;
    }
}
export class ServerRequestRejectedError extends AppServerError {
    method;
    name = "ServerRequestRejectedError";
    constructor(method) {
        super(`Rejected app-server request because no interactive handler is configured: ${method}`);
        this.method = method;
    }
}
export class NotificationBufferOverflowError extends AppServerError {
    capacity;
    name = "NotificationBufferOverflowError";
    constructor(capacity) {
        super(`App-server notification buffer exceeded ${capacity} entries`);
        this.capacity = capacity;
    }
}
//# sourceMappingURL=errors.js.map