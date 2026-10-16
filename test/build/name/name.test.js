"use strict";

const { cleanStderr, run } = require("../../utils/test-utils");

describe("name flag", () => {
  it("should set the flag in the config", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--name", "config-name"]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toContain("name: 'config-name'");
  });
});
