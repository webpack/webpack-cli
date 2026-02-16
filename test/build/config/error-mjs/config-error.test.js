"use strict";

const { resolve } = require("node:path");
const { run } = require("../../../utils/test-utils");

describe("config error", () => {
  it("should throw error with invalid configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.mjs"),
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Invalid configuration object");
    expect(stderr).toContain('"development" | "production" | "none"');
    expect(stdout).toBeFalsy();
  });

  it("should throw syntax error and exit with non-zero exit code", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "syntax-error.mjs"),
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Unexpected token");
    expect(stdout).toBeFalsy();
  });

  it("should throw syntax error and exit with non-zero exit code (force ESM loading)", async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["-c", resolve(__dirname, "syntax-error.mjs")],
      {
        env: { WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: true },
      },
    );

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Unexpected token");
    expect(stdout).toBeFalsy();
  });
});
