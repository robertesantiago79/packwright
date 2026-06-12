import { describe, expect, it } from "vitest";

import { engine } from "../src/core/index.js";

describe("stub engine", () => {
  it("exposes the compile facade required by adapters", async () => {
    const intake = { projectName: "Slice 0" };

    await expect(engine.compile(intake)).resolves.toEqual({
      status: "stub",
      intake,
    });
  });
});
