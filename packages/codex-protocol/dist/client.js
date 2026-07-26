import { AppServerProcessError, AppServerStateError, NotificationBufferOverflowError, } from "./errors.js";
import { AppServerTransport, } from "./transport.js";
class BoundedAsyncQueue {
    capacity;
    values = [];
    waiters = [];
    closed = false;
    failure;
    constructor(capacity) {
        this.capacity = capacity;
    }
    push(value) {
        if (this.closed || this.failure) {
            return;
        }
        const waiter = this.waiters.shift();
        if (waiter) {
            waiter.resolve({ value, done: false });
            return;
        }
        if (this.values.length >= this.capacity) {
            this.fail(new NotificationBufferOverflowError(this.capacity));
            return;
        }
        this.values.push(value);
    }
    close() {
        if (this.closed || this.failure) {
            return;
        }
        this.closed = true;
        if (this.values.length === 0) {
            for (const waiter of this.waiters.splice(0)) {
                waiter.resolve({ value: undefined, done: true });
            }
        }
    }
    fail(error) {
        if (this.failure) {
            return;
        }
        this.failure = error;
        this.values.length = 0;
        for (const waiter of this.waiters.splice(0)) {
            waiter.reject(error);
        }
    }
    [Symbol.asyncIterator]() {
        return {
            next: () => {
                if (this.failure) {
                    return Promise.reject(this.failure);
                }
                const value = this.values.shift();
                if (value !== undefined) {
                    return Promise.resolve({ value, done: false });
                }
                if (this.closed) {
                    return Promise.resolve({ value: undefined, done: true });
                }
                return new Promise((resolve, reject) => {
                    this.waiters.push({ resolve, reject });
                });
            },
        };
    }
}
function notificationThreadId(notification) {
    const params = notification.params;
    if (typeof params === "object" &&
        params !== null &&
        "threadId" in params &&
        typeof params.threadId === "string") {
        return params.threadId;
    }
    return undefined;
}
function notificationTurnId(notification) {
    const params = notification.params;
    if (typeof params !== "object" || params === null) {
        return undefined;
    }
    if ("turnId" in params && typeof params.turnId === "string") {
        return params.turnId;
    }
    if ("turn" in params &&
        typeof params.turn === "object" &&
        params.turn !== null &&
        "id" in params.turn &&
        typeof params.turn.id === "string") {
        return params.turn.id;
    }
    return undefined;
}
export class CodexAppServerClient {
    options;
    transport;
    stateValue = "disconnected";
    connectPromise;
    initializeResponse;
    constructor(options) {
        this.options = options;
        const transportOptions = {
            codexPathOverride: options.codexPathOverride,
            env: options.env,
            requestTimeoutMs: options.requestTimeoutMs ?? 30_000,
        };
        this.transport = new AppServerTransport(transportOptions);
        this.transport.onExit(() => {
            if (this.stateValue !== "closed") {
                this.stateValue = "disconnected";
                this.connectPromise = undefined;
                this.initializeResponse = undefined;
            }
        });
    }
    get state() {
        return this.stateValue;
    }
    connect() {
        if (this.stateValue === "closed") {
            return Promise.reject(new AppServerStateError("Codex app-server client is closed"));
        }
        if (this.initializeResponse) {
            return Promise.resolve(this.initializeResponse);
        }
        if (this.connectPromise) {
            return this.connectPromise;
        }
        this.stateValue = "connecting";
        this.transport.start();
        this.connectPromise = this.transport
            .request("initialize", {
            clientInfo: this.options.clientInfo,
            capabilities: {
                experimentalApi: false,
                requestAttestation: false,
                optOutNotificationMethods: this.options.optOutNotificationMethods ?? null,
            },
        })
            .then((response) => {
            this.transport.notify({ method: "initialized" });
            this.initializeResponse = response;
            this.stateValue = "connected";
            return response;
        })
            .catch(async (error) => {
            this.connectPromise = undefined;
            this.stateValue = "disconnected";
            await this.transport.close();
            throw error;
        });
        return this.connectPromise;
    }
    async close() {
        if (this.stateValue === "closed") {
            return;
        }
        this.stateValue = "closed";
        this.connectPromise = undefined;
        this.initializeResponse = undefined;
        await this.transport.close();
    }
    startThread(params) {
        this.assertConnected();
        return this.transport.request("thread/start", params);
    }
    resumeThread(params) {
        this.assertConnected();
        return this.transport.request("thread/resume", params);
    }
    startTurn(params) {
        this.assertConnected();
        return this.transport.request("turn/start", params);
    }
    async interruptTurn(params) {
        this.assertConnected();
        await this.transport.request("turn/interrupt", params);
    }
    async *streamTurn(params) {
        this.assertConnected();
        const capacity = this.options.notificationBufferSize ?? 1_024;
        if (!Number.isSafeInteger(capacity) || capacity <= 0) {
            throw new AppServerStateError("notificationBufferSize must be a positive integer");
        }
        const queue = new BoundedAsyncQueue(capacity);
        const earlyNotifications = [];
        let turnId;
        let receiptReceived = false;
        const pushNotification = (notification) => {
            if (notificationThreadId(notification) !== params.threadId) {
                return;
            }
            if (!receiptReceived) {
                if (earlyNotifications.length >= capacity) {
                    queue.fail(new NotificationBufferOverflowError(capacity));
                    return;
                }
                earlyNotifications.push(notification);
                return;
            }
            if (notificationTurnId(notification) !== turnId) {
                return;
            }
            queue.push(notification);
            if (notification.method === "turn/completed") {
                queue.close();
            }
        };
        const removeNotificationListener = this.transport.onNotification(pushNotification);
        const removeExitListener = this.transport.onExit((error) => {
            queue.fail(error);
        });
        try {
            const response = await this.startTurn(params);
            turnId = response.turn.id;
            receiptReceived = true;
            for (const notification of earlyNotifications) {
                if (notificationTurnId(notification) !== turnId) {
                    continue;
                }
                queue.push(notification);
                if (notification.method === "turn/completed") {
                    queue.close();
                }
            }
            earlyNotifications.length = 0;
            for await (const notification of queue) {
                yield notification;
            }
        }
        catch (error) {
            queue.fail(error instanceof Error
                ? error
                : new AppServerProcessError(String(error)));
            throw error;
        }
        finally {
            removeNotificationListener();
            removeExitListener();
        }
    }
    onNotification(method, listener) {
        return this.transport.onNotification((notification) => {
            if (notification.method === method) {
                listener(notification.params);
            }
        });
    }
    onError(listener) {
        return this.transport.onError(listener);
    }
    onStderr(listener) {
        return this.transport.onStderr(listener);
    }
    assertConnected() {
        if (this.stateValue !== "connected") {
            throw new AppServerStateError("Call connect() before using the Codex app-server client");
        }
    }
}
//# sourceMappingURL=client.js.map