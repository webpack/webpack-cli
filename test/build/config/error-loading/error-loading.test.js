"use strict";

const { run } = require("../../../utils/test-utils");

describe("config loading errors", () => {
  it("should surface the underlying code frame and exact location", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./runtime-error.config.js"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Failed to load './runtime-error.config.js' config");
    expect(stderr).toContain("▶ ESM (`import`) failed:");
    expect(stderr).toContain("▶ CJS (`require`) failed:");
    expect(stderr).toContain("Error: Boom from config");
    // The user's config frame (the line that threw) is kept in the output.
    expect(stderr).toContain("runtime-error.config.js:1");
    expect(stdout).toBeFalsy();
  });

  it("should surface the Node.js error code for a missing module", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./missing-module.config.js"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Failed to load './missing-module.config.js' config");
    expect(stderr).toContain("Cannot find module 'this-module-does-not-exist'");
    expect(stderr).toContain("code: MODULE_NOT_FOUND");
    expect(stdout).toBeFalsy();
  });

  it("should surface the error cause chain", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./cause.config.js"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Failed to load './cause.config.js' config");
    expect(stderr).toContain("Error: Failed to read settings");
    // The `cause` is not part of `error.stack`, so it must be appended explicitly.
    expect(stderr).toContain("Caused by:");
    expect(stderr).toContain("SyntaxError");
    expect(stdout).toBeFalsy();
  });
});
