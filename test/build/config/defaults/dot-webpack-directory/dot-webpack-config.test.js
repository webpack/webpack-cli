"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { run } = require("../../../../utils/test-utils");

describe(".webpack configuration file", () => {
  it("should build and not throw error when config is present in .webpack", async () => {
    const { stdout, stderr, exitCode } = await run(__dirname, []);
    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeDefined();
    expect(existsSync(resolve(__dirname, "./binary/dev.bundle.js"))).toBeTruthy();
  });
});
