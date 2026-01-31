"use strict";

const { normalizeStderr, normalizeStdout, run } = require("../utils/test-utils");

describe("help", () => {
  it('should show the same information using the "--help" option and command syntax', async () => {
    const {
      exitCode: exitCodeFromOption,
      stderr: stderrFromOption,
      stdout: stdoutFromOption,
    } = await run(__dirname, ["--help"]);
    const {
      exitCode: exitCodeFromCommandSyntax,
      stderr: stderrFromCommandSyntax,
      stdout: stdoutFromCommandSyntax,
    } = await run(__dirname, ["help"]);

    expect(exitCodeFromOption).toBe(0);
    expect(exitCodeFromCommandSyntax).toBe(0);
    expect(normalizeStderr(stderrFromOption)).toMatchSnapshot("stderr from option");
    expect(normalizeStderr(stderrFromCommandSyntax)).toMatchSnapshot("stderr from command syntax");
    expect(stdoutFromOption).toBe(stdoutFromCommandSyntax);
    expect(normalizeStdout(stdoutFromOption)).toMatchSnapshot("stdout from option");
    expect(normalizeStdout(stdoutFromCommandSyntax)).toMatchSnapshot("stdout from command syntax");
  });

  it('should log error for invalid flag with the "--help" option #3', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--help=invalid"]);

    expect(exitCode).toBe(2);
    expect(stderr).toMatchSnapshot();
    expect(stdout).toBeFalsy();
  });
});
