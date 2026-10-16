import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("Part 14 API readiness", () => {
  it("keeps basic liveness independent from the configured database", async () => {
    const app = createApp({ env: {} });
    const server = app.listen(0, "127.0.0.1");
    try {
      await new Promise<void>((resolve) => server.once("listening", resolve));
      const address = server.address();
      if (!address || typeof address === "string") throw Error("Missing port");
      const base = "http://127.0.0.1:" + address.port;
      expect((await fetch(base + "/api/health")).status).toBe(200);
      const readiness = await fetch(base + "/api/ready");
      expect(readiness.status).toBe(503);
      expect(await readiness.json()).toEqual({ status: "not-ready" });
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
