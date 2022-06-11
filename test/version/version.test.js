"use strict";

const { run, normalizeStderr, normalizeStdout } = require("../utils/test-utils");

describe("single version flag", () => {
  it("outputs versions with command syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs versions with dashed syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs versions with alias syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-v"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with info", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["info", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with info using option alias", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["info", "-v"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with info using command syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "info"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with info using command alias", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["v", "info"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with build", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["build", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with bundle", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["bundle", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with b", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["b", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with watch", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["watch", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with w", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["w", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with plugin", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["plugin", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with loader", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["loader", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with init", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["init", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with serve", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["serve", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs version with the alias c for init", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["c", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log error when unknown command using command syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "unknown"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log version for known command and log error for unknown command using command syntax with multi commands", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "info", "unknown"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should work for multiple commands", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["info", "serve", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should output versions for multiple commands using command syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "info", "serve"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should output versions with help command using command syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "help"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it('should log version for known command and log error for unknown command using the "--version" option', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["serve", "abc", "--version"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it('should log version for known command and log error for unknown command using the "-v" option', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["serve", "abc", "-v"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should not output version with help dashed", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "--help"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs versions with --color using option syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--version", "--color"], {
      env: { FORCE_COLOR: true },
    });

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs versions with --no-color using option syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--version", "--no-color"], {
      env: { FORCE_COLOR: true },
    });

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs versions with --color using command syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "--color"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("outputs versions with --no-color using command syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "--no-color"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log error when unknown command used", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "abc"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("throws error if invalid option is passed with version command", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "--abc"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log error when unknown command used with --version flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--version", "abc"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("throws error if invalid option is passed with --version flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--version", "--abc"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log error when unknown command used with -v alias", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-v", "abc"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("throws error if invalid option is passed with -v alias", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-v", "--abc"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it('should work using command syntax with the "version" value', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it('should work using command syntax and the "--version" argument', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "--version"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log an error using command syntax with unknown argument", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "--unknown"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log an error using command syntax with unknown argument #2", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["version", "info", "--unknown"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should log an error using command syntax with multiple commands with unknown argument", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "version",
      "info",
      "serve",
      "--unknown",
    ]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });
});
