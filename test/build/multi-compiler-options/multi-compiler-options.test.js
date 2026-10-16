"use strict";

const { cleanStderr, run } = require("../../utils/test-utils");

// Options for the whole MultiCompiler, such as `parallelism`, are set on the
// exported array itself and must survive every step that rebuilds the array.
describe("multi compiler options", () => {
  it("should pass the array's own options to webpack", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, []);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toContain("max concurrent compilers: 1");
  });

  it("should keep the array's own options with --config-name", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config-name",
      "first",
      "--config-name",
      "second",
    ]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toContain("max concurrent compilers: 1");
  });

  it("should keep the array's own options when configurations use extends", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./extends.config.js"]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toContain("max concurrent compilers: 1");
  });

  it("should keep the array's own options with --extends", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--extends", "./base.config.js"]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toContain("max concurrent compilers: 1");
  });
});
