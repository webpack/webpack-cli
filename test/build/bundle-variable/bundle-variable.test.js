"use strict";

const { cleanStderr, run } = require("../../utils/test-utils");

describe("bundle variable", () => {
  it("compiles without flags and export variable", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, []);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toContain("PASS");
  });
});
