"use strict";

const path = require("node:path");

const { run } = require("../../../utils/test-utils");

describe("env object", () => {
  it("is able to set env for an object", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();

    const { execa } = await import("execa");
    const executable = path.join(__dirname, "./dist/main.js");
    const bundledScript = await execa("node", [executable]);

    expect(bundledScript.stdout).toBe("environment is development");
  });
});
