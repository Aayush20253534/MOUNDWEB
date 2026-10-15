import { describe, expect, it } from "vitest";
import { PROJECT_NAME } from "./index.js";
describe("shared contract", () => {
  it("exposes brand identity", () => expect(PROJECT_NAME).toBe("MOUNDWEB"));
});
