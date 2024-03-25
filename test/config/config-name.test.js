"use strict";

const { run } = require("../utils/test-utils");

describe("--name flag", () => {
  it("should select only the config whose name is passed with --name", async () => {
    const { exitCode, stderr, stdout } = await run("config", [__dirname, "first"]);
    console.log(__dirname);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).not.toContain("second");
    expect(stdout).not.toContain("third");
  });

  it("should work with multiple values for --name", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--name",
      "first",
      "--name",
      "third",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).not.toContain("second");
    expect(stdout).toContain("third");
  });

  it("should work with multiple values for --name and multiple configurations", async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      [
        "-f",
        "./function-config.js",
        "-f",
        "./single-other-config.js",
        "--name",
        "first",
        "--name",
        "four",
      ],
      false,
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).not.toContain("second");
    expect(stdout).not.toContain("third");
    expect(stdout).toContain("four");
  });

  it("should log error if invalid config name is provided", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--name", "test"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain('Configuration with the name "test" was not found.');
    expect(stdout).toBeFalsy();
  });

  it("should log error if multiple configurations are not found", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--name",
      "test",
      "-f",
      "single-config.js",
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain('Configuration with the name "test" was not found.');
    expect(stdout).toBeFalsy();
  });

  it("should log error if multiple configurations are not found #1", async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--name", "test", "--name", "bar", "-f", "single-config.js"],
      false,
    );

    expect(exitCode).toBe(2);
    expect(stderr).toContain('Configuration with the name "test" was not found.');
    expect(stderr).toContain('Configuration with the name "bar" was not found.');
    expect(stdout).toBeFalsy();
  });

  it("should log error if multiple configurations are not found #2", async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--name", "first", "--name", "bar", "-f", "single-config.js"],
      false,
    );

    expect(exitCode).toBe(2);
    expect(stderr).toContain('Configuration with the name "bar" was not found.');
    expect(stdout).toBeFalsy();
  });

  it("should work with config as a function", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--file",
      "function-config.js",
      "--name",
      "first",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).not.toContain("second");
    expect(stdout).not.toContain("third");
  });

  it("should work with multiple values for --config-name when the config is a function", async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--file", "function-config.js", "--name", "first", "--name", "third"],
      false,
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("first");
    expect(stdout).not.toContain("second");
    expect(stdout).toContain("third");
  });

  it("should log error if invalid config name is provided ", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--file",
      "function-config.js",
      "--name",
      "test",
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain('Configuration with the name "test" was not found.');
    expect(stdout).toBeFalsy();
  });
});
