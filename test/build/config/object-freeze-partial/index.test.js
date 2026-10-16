"use strict";

const { resolve } = require("node:path");
const { cleanStderr, run } = require("../../../utils/test-utils");

describe("config with partial `Object.freeze({})`", () => {
  it("should not throw error", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
  });
});
