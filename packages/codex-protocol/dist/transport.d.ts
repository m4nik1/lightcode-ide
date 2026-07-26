import { type ChildProcessWithoutNullStreams } from "node:child_process";
import { AppServerProcessError } from "./errors.js";
import type { ClientNotification } from "./generated/ClientNotification.js";
import type { ServerNotification } from "./generated/ServerNotification.js";
import type { CoreMethod, CoreMethodResults, ParamsFor } from "./protocol-map.js";
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
export declare class AppServerTransport {
    private readonly options;
    private process;
    private lines;
    private nextRequestId;
    private readonly pending;
    private readonly notificationListeners;
    private readonly errorListeners;
    private readonly stderrListeners;
    private readonly exitListeners;
    private closing;
    private processTerminated;
    constructor(options: AppServerTransportOptions);
    get running(): boolean;
    start(): void;
    close(): Promise<void>;
    request<M extends CoreMethod>(method: M, params: ParamsFor<M>): Promise<CoreMethodResults[M]>;
    notify(notification: ClientNotification): void;
    onNotification(listener: NotificationListener): () => void;
    onError(listener: ErrorListener): () => void;
    onStderr(listener: StderrListener): () => void;
    onExit(listener: ExitListener): () => void;
    private writeMessage;
    private handleLine;
    private handleResponse;
    private handleServerRequest;
    private terminateProcess;
    private emitError;
}
export {};
//# sourceMappingURL=transport.d.ts.map