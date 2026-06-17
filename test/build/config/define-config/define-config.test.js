"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { run } = require("../../../utils/test-utils");

describe("defineConfig", () => {
  it("should build and not throw error with an object configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "define-config-object.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/define-config-object.js"))).toBeTruthy();
  });

  it("should build and not throw error with a multi-compiler configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "define-config-multi.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).toContain("second");
    expect(existsSync(resolve(__dirname, "./dist/define-config-multi-first.js"))).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/define-config-multi-second.js"))).toBeTruthy();
  });

  it("should build and not throw error with a function configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "define-config-function.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/define-config-function.js"))).toBeTruthy();
  });

  it("should build and not throw error with a function configuration returning an array", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "define-config-function-multi.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).toContain("second");
    expect(
      existsSync(resolve(__dirname, "./dist/define-config-function-multi-first.js")),
    ).toBeTruthy();
    expect(
      existsSync(resolve(__dirname, "./dist/define-config-function-multi-second.js")),
    ).toBeTruthy();
  });

  it("should build and not throw error with an async function configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "define-config-async-function.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/define-config-async-function.js"))).toBeTruthy();
  });

  it("should build and not throw error with an array of functions configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "define-config-array-functions.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).toContain("second");
    expect(existsSync(resolve(__dirname, "./dist/define-config-array-first.js"))).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/define-config-array-second.js"))).toBeTruthy();
  });

  it("should build and not throw error with a promise configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "define-config-promise.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("./src/index.js");
    expect(existsSync(resolve(__dirname, "./dist/define-config-promise.js"))).toBeTruthy();
  });

  it("should build and not throw error with a promise configuration returning an array", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      resolve(__dirname, "define-config-promise-multi.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).toContain("second");
    expect(
      existsSync(resolve(__dirname, "./dist/define-config-promise-multi-first.js")),
    ).toBeTruthy();
    expect(
      existsSync(resolve(__dirname, "./dist/define-config-promise-multi-second.js")),
    ).toBeTruthy();
  });
});
