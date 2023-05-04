"use strict";

const { run, readFile } = require("../../utils/test-utils");
const { resolve } = require("path");
const { existsSync } = require("fs");

const assertNoErrors = (exitCode, stderr, stdout, testDir) => {
  expect(exitCode).toBe(0);
  expect(stderr).toBeFalsy();
  expect(stdout).toBeTruthy();
  expect(existsSync(resolve(testDir, "./dist/main.js"))).toBeTruthy();
};

const getBuildOutput = async (testDir) => {
  try {
    return readFile(resolve(testDir, "./dist/main.js"), "utf-8");
  } catch (error) {
    expect(error).toBe(null);
  }
};

describe("dotenv-webpack-plugin", () => {
  it("reads .env file and defines variables correctly", async () => {
    const testDir = __dirname + "/builtin-config";
    const { exitCode, stderr, stdout } = await run(testDir, ["--entry", "./src/index.js"]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain("value1");
    expect(data).toContain("value2");
  });

  it("reads .env.production file and overrides values from .env variables correctly", async () => {
    const testDir = __dirname + "/overrides-config";
    const { exitCode, stderr, stdout } = await run(testDir, ["--entry", "./src/index.js"]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:",production_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:",production_value');
  });

  it("reads .env file and does not define a variable when it does not start with WEBPACK_", async () => {
    const testDir = __dirname + "/non-webpack-variable";
    const { exitCode, stderr, stdout } = await run(testDir, ["--entry", "./src/index.js"]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.NON_WEBPACK_VARIABLE:",process.env.NON_WEBPACK_VARIABLE');
    expect(data).toContain('"import.meta.env.NON_WEBPACK_VARIABLE:",(void 0).NON_WEBPACK_VARIABLE');
  });
});
