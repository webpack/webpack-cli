"use strict";

const { resolve } = require("node:path");
const { pathToFileURL } = require("node:url");
const { run } = require("../../../utils/test-utils");

describe("basic config file", () => {
  it("should build and not throw error with a basic configuration file", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.js"]);
    console.log(stdout);
    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should build and not throw error with a basic configuration file using relative path", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.js"]);
    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should build and not throw error with a basic configuration file using absolute path", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.js"),
    ]);
    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should build and not throw error with a basic configuration file using file protocol", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      pathToFileURL(resolve(__dirname, "webpack.config.js")).toString(),
    ]);
    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should build and not throw error with a basic using weird path", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "../basic/./webpack.config.js",
    ]);
    console.log(stdout);
    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });
});
