import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { AppServerProcessError, AppServerProtocolError, AppServerRpcError, AppServerStateError, AppServerTimeoutError, ServerRequestRejectedError, UnsupportedServerRequestError, } from "./errors.js";
const require = createRequire(import.meta.url);
const UNSUPPORTED_REQUEST_CODE = -32601;
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isRequestId(value) {
    return typeof value === "string" || typeof value === "number";
}
function resolveCodexCliPath() {
    const packageJsonPath = require.resolve("@openai/codex/package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    return path.join(path.dirname(packageJsonPath), packageJson.bin.codex);
}
function spawnDefaultProcess(options) {
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
    return spawn(process.execPath, [resolveCodexCliPath(), "app-server", "--stdio"], {
        env: environment,
        stdio: "pipe",
    });
}
export class AppServerTransport {
    options;
    process;
    lines;
    nextRequestId = 1;
    pending = new Map();
    notificationListeners = new Set();
    errorListeners = new Set();
    stderrListeners = new Set();
    exitListeners = new Set();
    closing = false;
    processTerminated = true;
    constructor(options) {
        this.options = options;
    }
    get running() {
        return this.process !== undefined && !this.processTerminated;
    }
    start() {
        if (this.running) {
            return;
        }
        this.closing = false;
        this.processTerminated = false;
        const child = this.options.spawnProcess?.() ?? spawnDefaultProcess(this.options);
        this.process = child;
        this.lines = readline.createInterface({
            input: child.stdout,
            crlfDelay: Infinity,
        });
        this.lines.on("line", (line) => this.handleLine(line));
        child.stderr.on("data", (chunk) => {
            const text = chunk.toString();
            for (const listener of this.stderrListeners) {
                try {
                    listener(text);
                }
                catch (error) {
                    this.emitError(error instanceof Error ? error : new Error(String(error)));
                }
            }
        });
        child.once("error", (cause) => {
            this.terminateProcess(new AppServerProcessError("Failed to start Codex app-server", null, null, {
                cause,
            }));
        });
        child.once("exit", (code, signal) => {
            const detail = signal ? `signal ${signal}` : `code ${code ?? 0}`;
            this.terminateProcess(new AppServerProcessError(this.closing
                ? `Codex app-server closed with ${detail}`
                : `Codex app-server exited with ${detail}`, code, signal));
        });
    }
    async close() {
        const child = this.process;
        if (!child || this.processTerminated) {
            return;
        }
        this.closing = true;
        const exited = new Promise((resolve) => {
            child.once("exit", () => resolve());
        });
        child.stdin.end();
        const graceful = await Promise.race([
            exited.then(() => true),
            new Promise((resolve) => {
                setTimeout(() => resolve(false), 2_000).unref();
            }),
        ]);
        if (!graceful && !child.killed) {
            child.kill();
            await Promise.race([
                exited,
                new Promise((resolve) => {
                    setTimeout(resolve, 500).unref();
                }),
            ]);
        }
    }
    request(method, params) {
        if (!this.running || !this.process) {
            return Promise.reject(new AppServerStateError("Codex app-server is not running"));
        }
        const id = this.nextRequestId++;
        const request = { id, method, params };
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                if (!this.pending.delete(id)) {
                    return;
                }
                reject(new AppServerTimeoutError(method, id, this.options.requestTimeoutMs));
            }, this.options.requestTimeoutMs);
            timer.unref();
            this.pending.set(id, {
                method,
                resolve: resolve,
                reject,
                timer,
            });
            try {
                this.writeMessage(request);
            }
            catch (error) {
                clearTimeout(timer);
                this.pending.delete(id);
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
    notify(notification) {
        if (!this.running) {
            throw new AppServerStateError("Codex app-server is not running");
        }
        this.writeMessage(notification);
    }
    onNotification(listener) {
        this.notificationListeners.add(listener);
        return () => {
            this.notificationListeners.delete(listener);
        };
    }
    onError(listener) {
        this.errorListeners.add(listener);
        return () => {
            this.errorListeners.delete(listener);
        };
    }
    onStderr(listener) {
        this.stderrListeners.add(listener);
        return () => {
            this.stderrListeners.delete(listener);
        };
    }
    onExit(listener) {
        this.exitListeners.add(listener);
        return () => {
            this.exitListeners.delete(listener);
        };
    }
    writeMessage(message) {
        if (!this.process || !this.running) {
            throw new AppServerStateError("Codex app-server is not running");
        }
        this.process.stdin.write(`${JSON.stringify(message)}\n`);
    }
    handleLine(line) {
        let message;
        try {
            message = JSON.parse(line);
        }
        catch (cause) {
            this.emitError(new AppServerProtocolError("Invalid JSON from Codex app-server", {
                line,
                cause,
            }));
            return;
        }
        if (!isRecord(message)) {
            this.emitError(new AppServerProtocolError("App-server message is not an object", message));
            return;
        }
        if (isRequestId(message.id) &&
            ("result" in message || "error" in message) &&
            !("method" in message)) {
            this.handleResponse(message);
            return;
        }
        if (isRequestId(message.id) &&
            typeof message.method === "string" &&
            "params" in message) {
            try {
                this.handleServerRequest(message);
            }
            catch (error) {
                this.emitError(error instanceof Error ? error : new Error(String(error)));
            }
            return;
        }
        if (typeof message.method === "string" &&
            !("id" in message) &&
            "params" in message) {
            const notification = message;
            for (const listener of this.notificationListeners) {
                try {
                    listener(notification);
                }
                catch (error) {
                    this.emitError(error instanceof Error ? error : new Error(String(error)));
                }
            }
            return;
        }
        this.emitError(new AppServerProtocolError("Unrecognized message from Codex app-server", message));
    }
    handleResponse(message) {
        const id = message.id;
        const pending = this.pending.get(id);
        if (!pending) {
            this.emitError(new AppServerProtocolError(`Received response for unknown request ${String(id)}`, message));
            return;
        }
        clearTimeout(pending.timer);
        this.pending.delete(id);
        if ("error" in message) {
            const failure = message;
            const error = isRecord(failure.error) ? failure.error : undefined;
            pending.reject(new AppServerRpcError(pending.method, id, typeof error?.code === "number" ? error.code : -32603, typeof error?.message === "string"
                ? error.message
                : "Unknown app-server error", error?.data));
            return;
        }
        pending.resolve(message.result);
    }
    handleServerRequest(request) {
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
    terminateProcess(error) {
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
            }
            catch (listenerError) {
                this.emitError(listenerError instanceof Error
                    ? listenerError
                    : new Error(String(listenerError)));
            }
        }
    }
    emitError(error) {
        for (const listener of this.errorListeners) {
            try {
                listener(error);
            }
            catch {
                // Diagnostic callbacks must never disrupt protocol processing.
            }
        }
    }
}
//# sourceMappingURL=transport.js.map