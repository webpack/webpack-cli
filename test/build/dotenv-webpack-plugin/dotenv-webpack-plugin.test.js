"use strict";

const { run, readFile } = require("../../utils/test-utils");
const { resolve } = require("path");
const { existsSync } = require("fs");

describe("dotenv-webpack-plugin", () => {
  it("reads .env file and defines variables correctly", async () => {
    const testDir = __dirname + "/builtin-config";
    const { exitCode, stderr, stdout } = await run(testDir, ["--entry", "./src/index.js"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(testDir, "./dist/main.js"))).toBeTruthy();

    let data;

    try {
      data = await readFile(resolve(testDir, "./dist/main.js"), "utf-8");
    } catch (error) {
      expect(error).toBe(null);
    }

    expect(data).toContain("Hello from index.js");
    expect(data).toContain("value1");
    expect(data).toContain("value2");
  });

  // write a test to check if cli overrides variables in .env file when .env.production file is present
  it("reads .env.production file and overrides values from .env variables correctly", async () => {
    const testDir = __dirname + "/overrides-config";
    const { exitCode, stderr, stdout } = await run(testDir, ["--entry", "./src/index.js"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(testDir, "./dist/main.js"))).toBeTruthy();

    let data;

    try {
      data = await readFile(resolve(testDir, "./dist/main.js"), "utf-8");
    } catch (error) {
      expect(error).toBe(null);
    }

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:",production_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:",production_value');
  });
});
