import type { RequestId } from "./generated/RequestId.js";

export class AppServerError extends Error {
  override readonly name: string = "AppServerError";
}

export class AppServerStateError extends AppServerError {
  override readonly name = "AppServerStateError";
}

export class AppServerProtocolError extends AppServerError {
  override readonly name = "AppServerProtocolError";

  constructor(
    message: string,
    readonly payload?: unknown,
  ) {
    super(message);
  }
}

export class AppServerRpcError extends AppServerError {
  override readonly name = "AppServerRpcError";

  constructor(
    readonly method: string,
    readonly requestId: RequestId,
    readonly code: number,
    message: string,
    readonly data?: unknown,
  ) {
    super(`${method} failed (${code}): ${message}`);
  }
}

export class AppServerTimeoutError extends AppServerError {
  override readonly name = "AppServerTimeoutError";

  constructor(
    readonly method: string,
    readonly requestId: RequestId,
    readonly timeoutMs: number,
  ) {
    super(`${method} timed out after ${timeoutMs}ms`);
  }
}

export class AppServerProcessError extends AppServerError {
  override readonly name = "AppServerProcessError";

  constructor(
    message: string,
    readonly exitCode: number | null = null,
    readonly signal: string | null = null,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }
}

export class UnsupportedServerRequestError extends AppServerError {
  override readonly name = "UnsupportedServerRequestError";

  constructor(readonly method: string) {
    super(`Unsupported app-server request: ${method}`);
  }
}

export class ServerRequestRejectedError extends AppServerError {
  override readonly name = "ServerRequestRejectedError";

  constructor(readonly method: string) {
    super(`Rejected app-server request because no interactive handler is configured: ${method}`);
  }
}

export class NotificationBufferOverflowError extends AppServerError {
  override readonly name = "NotificationBufferOverflowError";

  constructor(readonly capacity: number) {
    super(`App-server notification buffer exceeded ${capacity} entries`);
  }
}
