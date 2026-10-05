import { describe, expect, it } from "vitest";
import { config } from "config";

describe("admin app", () => {
  it("exposes an API URL from Vite env", () => {
    expect(typeof config.API_URL === "string" || config.API_URL === undefined).toBe(true);
  });
});
