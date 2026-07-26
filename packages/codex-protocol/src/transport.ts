import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import readline, { type Interface as ReadlineInterface } from "node:readline";
import {
  AppServerProcessError,
  AppServerProtocolError,
  AppServerRpcError,
  AppServerStateError,
  AppServerTimeoutError,
  ServerRequestRejectedError,
  UnsupportedServerRequestError,
} from "./errors.js";
import type { ClientNotification } from "./generated/ClientNotification.js";
import type { ClientRequest } from "./generated/ClientRequest.js";
import type { RequestId } from "./generated/RequestId.js";
import type { ServerNotification } from "./generated/ServerNotification.js";
import type { ServerRequest } from "./generated/ServerRequest.js";
import type {
  CoreMethod,
  CoreMethodResults,
  ParamsFor,
  RequestFor,
} from "./protocol-map.js";

type RpcSuccess<Result> = {
  id: RequestId;
  result: Result;
};

type RpcFailure = {
  id: RequestId;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type PendingRequest = {
  method: CoreMethod;
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
  timer: NodeJS.Timeout;
};

type NotificationListener = (notification: ServerNotification) => void;
type ErrorListener = (error: Error) => void;
type StderrListener = (text: string) => void;
type ExitListener = (error: AppServerProcessError) => void;

export type SpawnAppServerProcess = () => ChildProcessWithoutNullStreams;

export type AppServerTransportOptions = {
  codexPathOverride?: string;
  env?: Record<string, string>;
  requestTimeoutMs: number;
  spawnProcess?: SpawnAppServerProcess;
};

const require = createRequire(import.meta.url);
const UNSUPPORTED_REQUEST_CODE = -32601;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRequestId(value: unknown): value is RequestId {
  return typeof value === "string" || typeof value === "number";
}

function resolveCodexCliPath() {
  const packageJsonPath = require.resolve("@openai/codex/package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    bin: { codex: string };
  };
  return path.join(path.dirname(packageJsonPath), packageJson.bin.codex);
}

function spawnDefaultProcess(
  options: Pick<AppServerTransportOptions, "codexPathOverride" | "env">,
) {
  const environment = {
    ...process.env,
    ...options.env,
  };

  if (options.codexPathOverride) {
    return spawn(options.codexPathOverride, ["app-server", "--stdio"], {
      env: environment,
      stdio: "pipe",
    });
  }

  return spawn(
    process.execPath,
    [resolveCodexCliPath(), "app-server", "--stdio"],
    {
      env: environment,
      stdio: "pipe",
    },
  );
}

export class AppServerTransport {
  private process: ChildProcessWithoutNullStreams | undefined;
  private lines: ReadlineInterface | undefined;
  private nextRequestId = 1;
  private readonly pending = new Map<RequestId, PendingRequest>();
  private readonly notificationListeners = new Set<NotificationListener>();
  private readonly errorListeners = new Set<ErrorListener>();
  private readonly stderrListeners = new Set<StderrListener>();
  private readonly exitListeners = new Set<ExitListener>();
  private closing = false;
  private processTerminated = true;

  constructor(private readonly options: AppServerTransportOptions) {}

  get running() {
    return this.process !== undefined && !this.processTerminated;
  }

  start() {
    if (this.running) {
      return;
    }

    this.closing = false;
    this.processTerminated = false;
    const child =
      this.options.spawnProcess?.() ?? spawnDefaultProcess(this.options);
    this.process = child;
    this.lines = readline.createInterface({
      input: child.stdout,
      crlfDelay: Infinity,
    });

    this.lines.on("line", (line) => this.handleLine(line));
    child.stderr.on("data", (chunk: Buffer | string) => {
      const text = chunk.toString();
      for (const listener of this.stderrListeners) {
        try {
          listener(text);
        } catch (error) {
          this.emitError(
            error instanceof Error ? error : new Error(String(error)),
          );
        }
      }
    });
    child.stdin.on("error", (cause) => {
      this.emitError(
        new AppServerProcessError("Failed to write to Codex app-server", null, null, {
          cause,
        }),
      );
    });
    child.once("error", (cause) => {
      this.terminateProcess(
        new AppServerProcessError("Failed to start Codex app-server", null, null, {
          cause,
        }),
      );
    });
    child.once("exit", (code, signal) => {
      const detail = signal ? `signal ${signal}` : `code ${code ?? 0}`;
      this.terminateProcess(
        new AppServerProcessError(
          this.closing
            ? `Codex app-server closed with ${detail}`
            : `Codex app-server exited with ${detail}`,
          code,
          signal,
        ),
      );
    });
  }

  async close() {
    const child = this.process;
    if (!child || this.processTerminated) {
      return;
    }

    this.closing = true;
    const exited = new Promise<void>((resolve) => {
      child.once("exit", () => resolve());
    });
    child.stdin.end();

    const graceful = await Promise.race([
      exited.then(() => true),
      new Promise<false>((resolve) => {
        setTimeout(() => resolve(false), 2_000).unref();
      }),
    ]);

    if (!graceful && !child.killed) {
      child.kill();
      await Promise.race([
        exited,
        new Promise<void>((resolve) => {
          setTimeout(resolve, 500).unref();
        }),
      ]);
    }
  }

  request<M extends CoreMethod>(
    method: M,
    params: ParamsFor<M>,
  ): Promise<CoreMethodResults[M]> {
    if (!this.running || !this.process) {
      return Promise.reject(
        new AppServerStateError("Codex app-server is not running"),
      );
    }

    const id = this.nextRequestId++;
    const request = { id, method, params } as RequestFor<M>;

    return new Promise<CoreMethodResults[M]>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!this.pending.delete(id)) {
          return;
        }
        reject(new AppServerTimeoutError(method, id, this.options.requestTimeoutMs));
      }, this.options.requestTimeoutMs);
      timer.unref();

      this.pending.set(id, {
        method,
        resolve: resolve as (result: unknown) => void,
        reject,
        timer,
      });

      try {
        this.writeMessage(request);
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  notify(notification: ClientNotification) {
    if (!this.running) {
      throw new AppServerStateError("Codex app-server is not running");
    }
    this.writeMessage(notification);
  }

  onNotification(listener: NotificationListener) {
    this.notificationListeners.add(listener);
    return () => {
      this.notificationListeners.delete(listener);
    };
  }

  onError(listener: ErrorListener) {
    this.errorListeners.add(listener);
    return () => {
      this.errorListeners.delete(listener);
    };
  }

  onStderr(listener: StderrListener) {
    this.stderrListeners.add(listener);
    return () => {
      this.stderrListeners.delete(listener);
    };
  }

  onExit(listener: ExitListener) {
    this.exitListeners.add(listener);
    return () => {
      this.exitListeners.delete(listener);
    };
  }

  private writeMessage(message: unknown) {
    if (!this.process || !this.running) {
      throw new AppServerStateError("Codex app-server is not running");
    }
    this.process.stdin.write(`${JSON.stringify(message)}\n`);
  }

  private handleLine(line: string) {
    let message: unknown;
    try {
      message = JSON.parse(line);
    } catch (cause) {
      this.emitError(
        new AppServerProtocolError("Invalid JSON from Codex app-server", {
          line,
          cause,
        }),
      );
      return;
    }

    if (!isRecord(message)) {
      this.emitError(
        new AppServerProtocolError("App-server message is not an object", message),
      );
      return;
    }

    if (
      isRequestId(message.id) &&
      ("result" in message || "error" in message) &&
      !("method" in message)
    ) {
      this.handleResponse(message);
      return;
    }

    if (
      isRequestId(message.id) &&
      typeof message.method === "string" &&
      "params" in message
    ) {
      try {
        this.handleServerRequest(message as ServerRequest);
      } catch (error) {
        this.emitError(
          error instanceof Error ? error : new Error(String(error)),
        );
      }
      return;
    }

    if (
      typeof message.method === "string" &&
      !("id" in message) &&
      "params" in message
    ) {
      const notification = message as ServerNotification;
      for (const listener of this.notificationListeners) {
        try {
          listener(notification);
        } catch (error) {
          this.emitError(
            error instanceof Error ? error : new Error(String(error)),
          );
        }
      }
      return;
    }

    this.emitError(
      new AppServerProtocolError(
        "Unrecognized message from Codex app-server",
        message,
      ),
    );
  }

  private handleResponse(message: Record<string, unknown>) {
    const id = message.id as RequestId;
    const pending = this.pending.get(id);
    if (!pending) {
      this.emitError(
        new AppServerProtocolError(
          `Received response for unknown request ${String(id)}`,
          message,
        ),
      );
      return;
    }

    clearTimeout(pending.timer);
    this.pending.delete(id);

    if ("error" in message) {
      const failure = message as RpcFailure;
      const error = isRecord(failure.error) ? failure.error : undefined;
      pending.reject(
        new AppServerRpcError(
          pending.method,
          id,
          typeof error?.code === "number" ? error.code : -32603,
          typeof error?.message === "string"
            ? error.message
            : "Unknown app-server error",
          error?.data,
        ),
      );
      return;
    }

    pending.resolve((message as RpcSuccess<unknown>).result);
  }

  private handleServerRequest(request: ServerRequest) {
    const rejection = "Lightcode client does not expose interactive approvals";

    switch (request.method) {
      case "item/commandExecution/requestApproval":
      case "item/fileChange/requestApproval":
        this.writeMessage({ id: request.id, result: { decision: "decline" } });
        this.emitError(new ServerRequestRejectedError(request.method));
        break;
      case "applyPatchApproval":
      case "execCommandApproval":
        this.writeMessage({
          id: request.id,
          result: { decision: { denied: { rejection } } },
        });
        this.emitError(new ServerRequestRejectedError(request.method));
        break;
      case "mcpServer/elicitation/request":
        this.writeMessage({
          id: request.id,
          result: { action: "cancel", content: null, _meta: null },
        });
        this.emitError(new ServerRequestRejectedError(request.method));
        break;
      case "item/tool/requestUserInput":
        this.writeMessage({ id: request.id, result: { answers: {} } });
        this.emitError(new ServerRequestRejectedError(request.method));
        break;
      case "item/tool/call":
        this.writeMessage({
          id: request.id,
          result: { contentItems: [], success: false },
        });
        this.emitError(new ServerRequestRejectedError(request.method));
        break;
      default: {
        const error = new UnsupportedServerRequestError(request.method);
        this.writeMessage({
          id: request.id,
          error: {
            code: UNSUPPORTED_REQUEST_CODE,
            message: error.message,
          },
        });
        this.emitError(error);
      }
    }
  }

  private terminateProcess(error: AppServerProcessError) {
    if (this.processTerminated) {
      return;
    }
    this.processTerminated = true;
    this.lines?.close();
    this.lines = undefined;
    this.process = undefined;

    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();

    for (const listener of this.exitListeners) {
      try {
        listener(error);
      } catch (listenerError) {
        this.emitError(
          listenerError instanceof Error
            ? listenerError
            : new Error(String(listenerError)),
        );
      }
    }
  }

  private emitError(error: Error) {
    for (const listener of this.errorListeners) {
      try {
        listener(error);
      } catch {
        // Diagnostic callbacks must never disrupt protocol processing.
      }
    }
  }
}
