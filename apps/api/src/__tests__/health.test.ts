import { describe, expect, test } from "bun:test";

import { client } from "./helpers/api-test.js";

describe("GET /api/health", () => {
  test("status: ok を返す", async () => {
    const result = await client.health.check();
    expect(result).toEqual({ status: "ok", env: "local" });
  });
});
