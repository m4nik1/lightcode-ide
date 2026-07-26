import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AppServerStateError,
  NotificationBufferOverflowError,
} from "../dist/errors.js";
import { CodexAppServerClient } from "../dist/client.js";
import { AppServerTransport } from "../dist/transport.js";
import { FakeAppServerProcess } from "./helpers/fake-process.mjs";

const clientOptions = {
  clientInfo: {
    name: "test_client",
    title: "Test Client",
    version: "1.0.0",
  },
};

function createClient(onMessage, options = {}) {
  const child = new FakeAppServerProcess(onMessage);
  const transport = new AppServerTransport({
    requestTimeoutMs: 1_000,
    spawnProcess: () => child,
  });
  const client = new CodexAppServerClient({ ...clientOptions, ...options });

  // TypeScript private fields compile to ordinary properties. Replacing the
  // transport keeps process injection out of the public package API.
  client.transport = transport;
  transport.onExit(() => {
    if (client.state !== "closed") {
      client.stateValue = "disconnected";
      client.connectPromise = undefined;
      client.initializeResponse = undefined;
    }
  });

  return { child, client };
}

function initializeResponse(id) {
  return {
    id,
    result: {
      userAgent: "fake-app-server",
      codexHome: "/tmp/codex",
      platformFamily: "unix",
      platformOs: "macos",
    },
  };
}

test("connect initializes once and methods reject before initialization", async () => {
  const { child, client } = createClient((message, process) => {
    if (message.method === "initialize") {
      process.send(initializeResponse(message.id));
    }
  });

  assert.throws(() => client.startThread({}), AppServerStateError);

  const [first, second] = await Promise.all([client.connect(), client.connect()]);
  assert.equal(first.userAgent, "fake-app-server");
  assert.equal(second, first);
  assert.deepEqual(
    child.messages.map((message) => message.method),
    ["initialize", "initialized"],
  );
  assert.deepEqual(child.messages[0].params.capabilities, {
    experimentalApi: false,
    requestAttestation: false,
    optOutNotificationMethods: null,
  });

  await client.connect();
  assert.equal(
    child.messages.filter((message) => message.method === "initialize").length,
    1,
  );
  await client.close();
});

test("streamTurn retains early events and filters other threads and turns", async () => {
  const { client } = createClient((message, process) => {
    if (message.method === "initialize") {
      process.send(initializeResponse(message.id));
      return;
    }
    if (message.method === "turn/start") {
      process.send({
        method: "turn/started",
        params: {
          threadId: "other-thread",
          turn: { id: "other-turn" },
        },
      });
      process.send({
        method: "turn/started",
        params: {
          threadId: "thread-1",
          turn: { id: "turn-1" },
        },
      });
      process.send({
        method: "item/agentMessage/delta",
        params: {
          threadId: "thread-1",
          turnId: "turn-1",
          itemId: "item-1",
          delta: "hello",
        },
      });
      process.send({
        id: message.id,
        result: { turn: { id: "turn-1" } },
      });
      process.send({
        method: "item/agentMessage/delta",
        params: {
          threadId: "thread-1",
          turnId: "different-turn",
          itemId: "item-x",
          delta: "ignore",
        },
      });
      process.send({
        method: "turn/completed",
        params: {
          threadId: "thread-1",
          turn: { id: "turn-1", status: "completed" },
        },
      });
    }
  });

  await client.connect();
  const events = [];
  for await (const event of client.streamTurn({
    threadId: "thread-1",
    input: [{ type: "text", text: "hello", text_elements: [] }],
  })) {
    events.push(event);
  }

  assert.deepEqual(
    events.map((event) => event.method),
    [
      "turn/started",
      "item/agentMessage/delta",
      "turn/completed",
    ],
  );
  await client.close();
});

test("streamTurn fails a slow consumer when its bounded buffer overflows", async () => {
  const { client } = createClient(
    (message, process) => {
      if (message.method === "initialize") {
        process.send(initializeResponse(message.id));
        return;
      }
      if (message.method === "turn/start") {
        for (const delta of ["one", "two"]) {
          process.send({
            method: "item/agentMessage/delta",
            params: {
              threadId: "thread-1",
              turnId: "turn-1",
              itemId: "item-1",
              delta,
            },
          });
        }
        process.send({
          id: message.id,
          result: { turn: { id: "turn-1" } },
        });
      }
    },
    { notificationBufferSize: 1 },
  );

  await client.connect();
  await assert.rejects(
    async () => {
      for await (const _event of client.streamTurn({
        threadId: "thread-1",
        input: [{ type: "text", text: "hello", text_elements: [] }],
      })) {
        // The early-event buffer overflows before iteration can consume it.
      }
    },
    NotificationBufferOverflowError,
  );
  await client.close();
});
