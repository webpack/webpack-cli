"use strict";

const { run, readFile } = require("../../utils/test-utils");
const { resolve, join } = require("path");
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
    const testDir = join(__dirname, "/builtin-config");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain("value1");
    expect(data).toContain("value2");
  });

  it("reads .env.production file and overrides values from .env variables correctly", async () => {
    const testDir = join(__dirname, "/overrides-config");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:",production_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:",production_value');
  });

  it("reads .env file and does not define a variable when it does not start with WEBPACK_", async () => {
    const testDir = join(__dirname, "/non-webpack-variable");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.NON_WEBPACK_VARIABLE:",process.env.NON_WEBPACK_VARIABLE');
    expect(data).toContain('"import.meta.env.NON_WEBPACK_VARIABLE:",(void 0).NON_WEBPACK_VARIABLE');
    expect(data).not.toContain("variable_value");
  });

  it("reads .env.production when mode is set to production", async () => {
    const testDir = join(__dirname, "/mode-production");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
      "--mode",
      "production",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:",production_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:",production_value');
    expect(data).not.toContain("default_value");
    expect(data).not.toContain("development_value");
  });

  it("reads .env.development when mode is set to development", async () => {
    const testDir = join(__dirname, "/mode-development");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
      "--mode",
      "development",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    // TODO check why webpack adds "\\" to the value only in development mode
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:\\", development_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:\\", development_value');
    expect(data).not.toContain("default_value");
    expect(data).not.toContain("production_value");
  });

  it("reads .env.none when mode is set to none", async () => {
    const testDir = join(__dirname, "/mode-none");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
      "--mode",
      "none",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:", none_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:", none_value');
    expect(data).not.toContain("default_value");
    expect(data).not.toContain("production_value");
    expect(data).not.toContain("development_value");
  });

  it("reads .env.example when file is present", async () => {
    const testDir = join(__dirname, "/env-example");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:",example_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:",example_value');
  });

  it("overrides value from .env when same key in .env.local is present", async () => {
    const testDir = join(__dirname, "/overrides-local");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:",local_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:",local_value');
    expect(data).not.toContain("default_value");
  });

  it("overrides value from .env.[mode] when same key in .env.[mode].local is present", async () => {
    const testDir = join(__dirname, "/overrides-local");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.WEBPACK_VARIABLE:",local_value');
    expect(data).toContain('"import.meta.env.WEBPACK_VARIABLE:",local_value');
    expect(data).not.toContain("production_value");
  });
});
