"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { cleanStderr, run } = require("../../../../utils/test-utils");

describe("default config with mode from cli", () => {
  it("should build and not throw error with development mode supplied", async () => {
    const { stdout, stderr, exitCode } = await run(__dirname, ["--mode", "development"]);
    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeDefined();
    expect(existsSync(resolve(__dirname, "./binary/dev.bundle.js"))).toBeTruthy();
  });
});
