const { join } = require("node:path");
const { run } = require("../utils/test-utils");

describe("basic usage", () => {
  it("should work", async () => {
    const { exitCode, stdout, stderr } = await run(join(__dirname, "../../"), ["version"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("webpack");
  });

  it("should work with v alias", async () => {
    const { exitCode, stdout, stderr } = await run(join(__dirname, "../../"), ["v"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("webpack:");
  });

  it("should work with --version", async () => {
    const { exitCode, stdout, stderr } = await run(join(__dirname, "../../"), ["--version"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("webpack:");
  });

  it("should work with -v alias", async () => {
    const { exitCode, stdout, stderr } = await run(join(__dirname, "../../"), ["-v"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("webpack:");
  });

  it("should work and gets more info in project root", async () => {
    const { exitCode, stderr, stdout } = await run(join(__dirname, "../../"), ["version"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("webpack:");
  });

  it("shows an appropriate warning on supplying unknown args", async () => {
    const { exitCode, stderr, stdout } = await run(join(__dirname, "../../"), [
      "version",
      "--unknown",
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Error: Unknown option '--unknown'");
    expect(stdout).toBeFalsy();
  });
});
