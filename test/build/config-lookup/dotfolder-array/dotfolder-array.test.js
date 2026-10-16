"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { cleanStderr, run } = require("../../../utils/test-utils");

describe("dotfolder array config lookup", () => {
  it("should find a webpack array configuration in a dotfolder", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, []);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/dist-commonjs.js"))).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/dist-amd.js"))).toBeTruthy();
  });
});
