"use strict";

const { join } = require("node:path");
const { run } = require("../utils/test-utils");

describe("'-o, --output <value>' usage", () => {
  it("gets info text by default", async () => {
    const { exitCode, stdout, stderr } = await run(join(__dirname, "../../"), ["version"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("webpack:");
  });

  it("gets info as json", async () => {
    const { exitCode, stderr, stdout } = await run(join(__dirname, "../../"), [
      "version",
      "--output=json",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain('"Packages":');

    const parse = () => {
      const output = JSON.parse(stdout);
      expect(output.Packages).toBeTruthy();
    };

    expect(parse).not.toThrow();
  });

  it("gets info as markdown", async () => {
    const { exitCode, stderr, stdout } = await run(join(__dirname, "../../"), [
      "version",
      "--output",
      "markdown",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("## Packages:");
  });

  it("shows a warning if an invalid value is supplied", async () => {
    const { exitCode, stderr, stdout } = await run(join(__dirname, "../../"), [
      "version",
      "--output",
      "unknown",
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("'unknown' is not a valid value for output");
    expect(stdout).toBeFalsy();
  });

  it("recognizes '-o' as an alias for '--output'", async () => {
    const { exitCode, stderr, stdout } = await run(join(__dirname, "../../"), [
      "version",
      "-o",
      "markdown",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("## Packages:");
  });
});
