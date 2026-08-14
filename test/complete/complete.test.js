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

  it("should suggest flags for the build command", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["complete", "--", "build", "--"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();

    const suggestions = parseCompletions(stdout);

    expect(suggestions).toEqual(expect.arrayContaining(["--mode", "--config", "--entry"]));
  });
});
