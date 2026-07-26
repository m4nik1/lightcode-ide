import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AppServerProcessError,
  AppServerProtocolError,
  AppServerRpcError,
  AppServerTimeoutError,
  ServerRequestRejectedError,
  UnsupportedServerRequestError,
} from "../dist/errors.js";
import { AppServerTransport } from "../dist/transport.js";
import { FakeAppServerProcess } from "./helpers/fake-process.mjs";

function createTransport(onMessage, options = {}) {
  const child = new FakeAppServerProcess(onMessage);
  const transport = new AppServerTransport({
    requestTimeoutMs: options.requestTimeoutMs ?? 1_000,
    spawnProcess: () => child,
  });
  transport.start();
  return { child, transport };
}

test("correlates out-of-order responses and keeps notifications separate", async () => {
  const { child, transport } = createTransport();
  const notifications = [];
  const stderr = [];
  transport.onNotification((notification) => notifications.push(notification));
  transport.onStderr((text) => stderr.push(text));

  const initialize = transport.request("initialize", {
    clientInfo: { name: "test", title: "Test", version: "1" },
    capabilities: null,
  });
  const thread = transport.request("thread/start", {});

  const [initializeRequest, threadRequest] = child.messages;
  child.log('{"id":999,"result":"stderr is not protocol"}\n');
  child.send({
    id: threadRequest.id,
    result: { thread: { id: "thread-1" } },
  });
  child.send({
    method: "warning",
    params: { message: "notice" },
  });
  child.send({
    id: initializeRequest.id,
    result: {
      userAgent: "fake",
      codexHome: "/tmp/codex",
      platformFamily: "unix",
      platformOs: "macos",
    },
  });

  assert.equal((await thread).thread.id, "thread-1");
  assert.equal((await initialize).userAgent, "fake");
  assert.equal(notifications.length, 1);
  assert.equal(notifications[0].method, "warning");
  assert.match(stderr.join(""), /not protocol/);
  await transport.close();
});

test("turns RPC failures, timeouts, and process exits into typed errors", async () => {
  {
    const { child, transport } = createTransport();
    const request = transport.request("thread/start", {});
    child.send({
      id: child.messages[0].id,
      error: { code: 42, message: "no thread", data: { retry: false } },
    });
    await assert.rejects(
      request,
      (error) =>
        error instanceof AppServerRpcError &&
        error.code === 42 &&
        error.method === "thread/start",
    );
    await transport.close();
  }

  {
    const { transport } = createTransport(undefined, { requestTimeoutMs: 10 });
    await assert.rejects(
      transport.request("thread/start", {}),
      AppServerTimeoutError,
    );
    await transport.close();
  }

  {
    const { child, transport } = createTransport();
    const request = transport.request("thread/start", {});
    child.exit(7, null);
    await assert.rejects(
      request,
      (error) =>
        error instanceof AppServerProcessError && error.exitCode === 7,
    );
  }
});

test("declines known server requests and errors unsupported requests", async () => {
  const { child, transport } = createTransport();
  const errors = [];
  transport.onError((error) => errors.push(error));

  child.send({
    id: "approval-1",
    method: "item/commandExecution/requestApproval",
    params: {
      threadId: "thread-1",
      turnId: "turn-1",
      itemId: "item-1",
      startedAtMs: 1,
      environmentId: null,
    },
  });
  assert.deepEqual(child.messages.at(-1), {
    id: "approval-1",
    result: { decision: "decline" },
  });
  assert.ok(errors.at(-1) instanceof ServerRequestRejectedError);

  child.send({
    id: "permission-1",
    method: "item/permissions/requestApproval",
    params: {},
  });
  assert.deepEqual(child.messages.at(-1), {
    id: "permission-1",
    error: {
      code: -32601,
      message:
        "Unsupported app-server request: item/permissions/requestApproval",
    },
  });
  assert.ok(errors.at(-1) instanceof UnsupportedServerRequestError);
  await transport.close();
});

test("reports malformed and unrecognized stdout without crashing the reader", async () => {
  const { child, transport } = createTransport();
  const errors = [];
  transport.onError((error) => errors.push(error));

  child.sendRaw("{not-json");
  child.send({ id: 99, unexpected: true });
  child.send({ id: 123, result: {} });

  assert.equal(errors.length, 3);
  assert.ok(errors.every((error) => error instanceof AppServerProtocolError));
  await transport.close();
});

test("surfaces stdin stream errors through onError instead of crashing", async () => {
  const { child, transport } = createTransport();
  const errors = [];
  transport.onError((error) => errors.push(error));

  child.stdin.destroy(new Error("write EPIPE"));
  await new Promise((resolve) => setImmediate(resolve));

  assert.ok(
    errors.some(
      (error) =>
        error instanceof AppServerProcessError &&
        error.cause instanceof Error &&
        error.cause.message === "write EPIPE",
    ),
  );

  // Writing to the broken pipe must not throw; the already-destroyed stream
  // swallows the write error rather than emitting again.
  assert.doesNotThrow(() => transport.notify({ method: "initialized" }));
  await new Promise((resolve) => setImmediate(resolve));

  child.exit(1, null);
});

test("close ends stdin and waits for process exit", async () => {
  const { child, transport } = createTransport();
  await transport.close();
  assert.equal(transport.running, false);
  assert.equal(child.killed, false);
});
