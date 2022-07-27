"use strict";

const { run, readFile } = require("../../../utils/test-utils");
const { existsSync } = require("fs");
const { resolve } = require("path");

describe("entry flag", () => {
  it("should resolve the path to src/index.cjs", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--entry", "./src/index.cjs"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should load ./src/a.js as entry", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--entry", "./src/a.js"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should resolve the path to /src/a.js as ./src/a.js", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--entry", "/src/a.js"]);
    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/main.js"))).toBeTruthy();

    let data;

    try {
      data = await readFile(resolve(__dirname, "./dist/main.js"), "utf-8");
    } catch (error) {
      expect(error).toBe(null);
    }

    expect(data).toContain("Hello from a.js");
  });

  it("should throw error for invalid entry file", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--entry", "./src/test.js"]);

    expect(exitCode).toEqual(1);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("Module not found: Error: Can't resolve");
  });
});
