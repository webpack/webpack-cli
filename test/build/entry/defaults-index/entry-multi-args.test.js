"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");

const { cleanStderr, run } = require("../../../utils/test-utils");

describe("single entry flag index present", () => {
  it("finds default index file and compiles successfully", async () => {
    const { stderr, stdout, exitCode } = await run(__dirname);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stderr).not.toContain("Module not found");
    expect(stdout).toBeTruthy();
  });

  it("finds default index file, compiles and overrides with flags successfully", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--output-path", "bin"]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./bin/main.js"))).toBeTruthy();
  });
});
