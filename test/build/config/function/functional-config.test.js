"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { run } = require("../../../utils/test-utils");

describe("functional config", () => {
  it("should build and not throw error with single configuration", async () => {
    const { stderr, stdout, exitCode } = await run(__dirname, [
      "--config",
      resolve(__dirname, "single-webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/single.js"))).toBeTruthy();
  });

  it("should build and not throw error with async single configuration", async () => {
    const { stderr, stdout, exitCode } = await run(__dirname, [
      "--config",
      resolve(__dirname, "async-single-webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/async-single.js"))).toBeTruthy();
  });

  it("should build and not throw errors with multiple configurations", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "multi-webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).toContain("second");
    expect(existsSync(resolve(__dirname, "./dist/multi-first.js"))).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/multi-second.js"))).toBeTruthy();
  });

  it("should build and not throw errors with async multiple configurations", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "async-multi-webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).toContain("second");
    expect(existsSync(resolve(__dirname, "./dist/multi-async-first.js"))).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/multi-async-second.js"))).toBeTruthy();
  });

  it("should build and not throw errors with promise configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "promise.webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/promise-single.js"))).toBeTruthy();
  });

  it("should build and not throw errors with env configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "env.config.js"),
      "--env=name=env",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/env-single.js"))).toBeTruthy();
  });

  it("should build and not throw errors with async env configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "async-env.config.js"),
      "--env=name=env",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/async-env-single.js"))).toBeTruthy();
  });

  it("should build and not throw errors with function each multiple configurations", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "function-each-multi-webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).toContain("second");
    expect(existsSync(resolve(__dirname, "./dist/function-each-first.js"))).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/function-each-second.js"))).toBeTruthy();
  });
});
