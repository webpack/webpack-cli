"use strict";

const { run } = require("../utils/test-utils");

const parseCompletions = (stdout) =>
  stdout
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line && !line.startsWith(":"))
    .map((line) => line.split("\t")[0]);

describe("complete", () => {
  it("should generate a zsh completion script", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "zsh"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("webpack");
    expect(stdout).toContain("complete");
  });

  it("should generate a bash completion script", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "bash"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("webpack");
  });

  it("should suggest commands", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", ""]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();

    const suggestions = parseCompletions(stdout);

    expect(suggestions).toEqual(expect.arrayContaining(["build", "watch", "serve", "info"]));
  });

  it("should suggest option values for --mode", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "complete",
      "--",
      "build",
      "--mode=",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();

    const suggestions = parseCompletions(stdout);

    expect(suggestions).toEqual(expect.arrayContaining(["development", "production", "none"]));
  });

  it("should suggest option values for info --output", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "complete",
      "--",
      "info",
      "--output=",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();

    const suggestions = parseCompletions(stdout);

    expect(suggestions).toEqual(expect.arrayContaining(["json", "markdown"]));
  });

  it("should expand a partial command to a single suggestion", async () => {
    // `webpack b<TAB>` has to offer `build` alone, so the shell writes it out;
    // suggesting the alias `b` next to it would leave the word as typed.
    for (const [typed, command] of [
      ["b", "build"],
      ["w", "watch"],
      ["s", "serve"],
      ["i", "info"],
    ]) {
      const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", typed]);

      expect(exitCode).toBe(0);
      expect(stderr).toBeFalsy();
      expect(parseCompletions(stdout)).toEqual([command]);
    }
  });

  it("should suggest the same options for a command alias", async () => {
    const { stdout: canonical } = await run(__dirname, ["complete", "--", "build", "--"]);

    for (const alias of ["b", "bundle"]) {
      const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", alias, "--"]);

      expect(exitCode).toBe(0);
      expect(stderr).toBeFalsy();
      expect(parseCompletions(stdout)).toEqual(parseCompletions(canonical));
    }
  });

  it("should suggest option values for a command alias", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", "b", "--mode="]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(parseCompletions(stdout)).toEqual(
      expect.arrayContaining(["development", "production", "none"]),
    );
  });

  it("should suggest option values for build --progress", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "complete",
      "--",
      "build",
      "--progress=",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(parseCompletions(stdout)).toEqual(expect.arrayContaining(["profile"]));
  });

  it("should suggest option values for version --output", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "complete",
      "--",
      "version",
      "--output=",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(parseCompletions(stdout)).toEqual(expect.arrayContaining(["json", "markdown"]));
  });

  it("should suggest option values for --help", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", "--help="]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(parseCompletions(stdout)).toEqual(expect.arrayContaining(["verbose"]));
  });

  it("should suggest shells for the complete command", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", "complete", ""]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(parseCompletions(stdout)).toEqual(
      expect.arrayContaining(["zsh", "bash", "fish", "powershell"]),
    );
  });

  it("should suggest global options after a command", async () => {
    for (const command of ["build", "serve", "help"]) {
      const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", command, "--"]);

      expect(exitCode).toBe(0);
      expect(stderr).toBeFalsy();
      expect(parseCompletions(stdout)).toEqual(
        expect.arrayContaining(["--color", "--no-color", "--help"]),
      );
    }
  });

  it("should not suggest aliases as commands", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", ""]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();

    const suggestions = parseCompletions(stdout);

    expect(suggestions).toEqual(expect.arrayContaining(["build", "watch", "serve"]));

    for (const alias of ["b", "bundle", "w", "s", "server"]) {
      expect(suggestions).not.toContain(alias);
    }
  });

  it("should suggest flags for the build command", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", "build", "--"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();

    const suggestions = parseCompletions(stdout);

    expect(suggestions).toEqual(expect.arrayContaining(["--mode", "--config", "--entry"]));
  });
});
