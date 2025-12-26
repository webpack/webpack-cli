"use strict";

const path = require("node:path");

const { run } = require("../../../utils/test-utils");

const devFile = path.join(__dirname, "./dist/dev.js");
const prodFile = path.join(__dirname, "./dist/prod.js");

describe("env array", () => {
  it("is able to set two different environments for an array configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();

    const { execa } = await import("execa");
    const devScript = await execa("node", [devFile]);
    const prodScript = await execa("node", [prodFile]);

    expect(devScript.stdout).toBe("environment is development");
    expect(prodScript.stdout).toBe("environment is production");
  });
});
