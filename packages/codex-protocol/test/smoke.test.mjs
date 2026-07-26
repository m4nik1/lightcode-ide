import assert from "node:assert/strict";
import { test } from "node:test";
import { CodexAppServerClient } from "../dist/index.js";

test(
  "real app-server initializes and closes",
  { skip: process.env.LIGHTCODE_CODEX_SMOKE !== "1" },
  async () => {
    const client = new CodexAppServerClient({
      clientInfo: {
        name: "lightcode_protocol_smoke_test",
        title: "Lightcode Protocol Smoke Test",
        version: "0.1.0",
      },
      requestTimeoutMs: 15_000,
    });

    try {
      const response = await client.connect();
      assert.equal(typeof response.userAgent, "string");
      assert.equal(typeof response.platformFamily, "string");
      assert.equal(typeof response.platformOs, "string");
    } finally {
      await client.close();
    }
  },
);
