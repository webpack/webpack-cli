"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { resolve } = require("node:path");
const { pathToFileURL } = require("node:url");
const { cleanStderr, run } = require("../../../utils/test-utils");

describe("basic config file", () => {
  it("should build and not throw error with a basic configuration file", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.js"]);
    console.log(stdout);
    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should build and not throw error with a basic configuration file using relative path", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.js"]);
    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should build and not throw error with a basic configuration file using absolute path", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.js"),
    ]);
    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should build and not throw error with a basic configuration file using file protocol", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      pathToFileURL(resolve(__dirname, "webpack.config.js")).toString(),
    ]);
    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("should load a configuration path as a module specifier and not run it as code", async () => {
    const marker = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), "webpack-cli-config-path-")),
      "executed",
    );
    const configPath = `file:///webpack.config.js"),require("node:fs").writeFileSync(${JSON.stringify(marker)},""),import("file:///webpack.config.js`;

    try {
      const { exitCode, stderr } = await run(__dirname, ["-c", configPath]);

      expect(exitCode).toBe(2);
      expect(stderr).toContain("Failed to load");
      expect(fs.existsSync(marker)).toBe(false);
    } finally {
      fs.rmSync(path.dirname(marker), { recursive: true, force: true });
    }
  });

  it("should build and not throw error with a basic using weird path", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "../basic/./webpack.config.js",
    ]);
    console.log(stdout);
    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
  });
});
