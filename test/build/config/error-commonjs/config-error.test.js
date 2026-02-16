"use strict";

const { resolve } = require("node:path");
const { normalizeStderr, run } = require("../../../utils/test-utils");

describe("config with errors", () => {
  it("should throw error with invalid configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.js"),
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Invalid configuration object");
    expect(stderr).toContain('"development" | "production" | "none"');
    expect(stdout).toBeFalsy();
  });

  it("should throw syntax error and exit with non-zero exit code", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "syntax-error.js"),
    ]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot();
    expect(stdout).toBeFalsy();
  });
});
