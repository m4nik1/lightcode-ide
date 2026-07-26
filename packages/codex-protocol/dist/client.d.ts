import type { InitializeResponse } from "./generated/InitializeResponse.js";
import type { ServerNotification } from "./generated/ServerNotification.js";
import type { ThreadResumeParams } from "./generated/v2/ThreadResumeParams.js";
import type { ThreadResumeResponse } from "./generated/v2/ThreadResumeResponse.js";
import type { ThreadStartParams } from "./generated/v2/ThreadStartParams.js";
import type { ThreadStartResponse } from "./generated/v2/ThreadStartResponse.js";
import type { TurnInterruptParams } from "./generated/v2/TurnInterruptParams.js";
import type { TurnStartParams } from "./generated/v2/TurnStartParams.js";
import type { TurnStartResponse } from "./generated/v2/TurnStartResponse.js";
import type { AppServerClientState, CodexAppServerClientOptions } from "./types.js";
type NotificationMethod = ServerNotification["method"];
type NotificationFor<M extends NotificationMethod> = Extract<ServerNotification, {
    method: M;
}>;
type NotificationParams<M extends NotificationMethod> = NotificationFor<M> extends {
    params: infer Params;
} ? Params : never;
export declare class CodexAppServerClient {
    private readonly options;
    private readonly transport;
    private stateValue;
    private connectPromise;
    private initializeResponse;
    constructor(options: CodexAppServerClientOptions);
    get state(): AppServerClientState;
    connect(): Promise<InitializeResponse>;
    close(): Promise<void>;
    startThread(params: ThreadStartParams): Promise<ThreadStartResponse>;
    resumeThread(params: ThreadResumeParams): Promise<ThreadResumeResponse>;
    startTurn(params: TurnStartParams): Promise<TurnStartResponse>;
    interruptTurn(params: TurnInterruptParams): Promise<void>;
    streamTurn(params: TurnStartParams): AsyncIterable<ServerNotification>;
    onNotification<M extends NotificationMethod>(method: M, listener: (params: NotificationParams<M>) => void): () => void;
    onError(listener: (error: Error) => void): () => void;
    onStderr(listener: (text: string) => void): () => void;
    private assertConnected;
}
export {};
//# sourceMappingURL=client.d.ts.map