"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { run } = require("../../../../utils/test-utils");

describe(".webpack webpackfile", () => {
  it("should build and not throw with .webpack webpackfile", async () => {
    const { stdout, stderr, exitCode } = await run(__dirname, []);
    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeDefined();
    expect(existsSync(resolve(__dirname, "./binary/dev.folder.js"))).toBeTruthy();
  });
});
