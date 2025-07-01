"use strict";

const { resolve } = require("node:path");
const { run } = require("../../utils/test-utils");

describe("colors", () => {
  it("should output by default", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [], {
      env: { FORCE_COLOR: true },
    });

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option from flags', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--stats=verbose"], {
      env: { FORCE_COLOR: true },
    });

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option from flags and from configuration', async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--stats=verbose", `--config=${resolve(__dirname, "./no-stats.webpack.config.js")}`],
      { env: { FORCE_COLOR: true } },
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option from flags and from configuration #2', async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--stats=verbose", "--config=stats-string.webpack.config.js"],
      {
        env: { FORCE_COLOR: true },
      },
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option and --color flags', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--stats=verbose", "--color"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it("should disable colored output with --no-color", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--stats=verbose", "--no-color"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).not.toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
    expect(stdout).toContain("successfully");
  });

  it('should work with the "stats" option from the configuration', async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--config=stats-string.webpack.config.js"],
      {
        env: { FORCE_COLOR: true },
      },
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option from the configuration #1', async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--config=stats-boolean.webpack.config.js"],
      {
        env: { FORCE_COLOR: true },
      },
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option from the configuration #2', async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--config=no-stats.webpack.config.js"],
      {
        env: { FORCE_COLOR: true },
      },
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option from the configuration #3', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config=colors-true.webpack.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option from the configuration #4', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config=colors-false.webpack.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).not.toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
    expect(stdout).toContain("successfully");
  });

  it('should work with the "stats" option from the configuration #5', async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--config=stats-colors.webpack.config.js"],
      {
        env: { FORCE_COLOR: true },
      },
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[31msuccessfully\u001B[39m\u001B[22m");
  });

  it('should work with the "stats" option from the configuration in multi compiler mode', async () => {
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["--config=multi-stats-colors.webpack.config.js"],
      {
        env: { FORCE_COLOR: true },
      },
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    // red from first config
    expect(stdout).toContain("\u001B[31msuccessfully");
    // blue from second config
    expect(stdout).toContain("\u001B[34msuccessfully");
  });

  it("should prioritize --color over colors in config", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config=colors-false.webpack.config.js",
      "--color",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });

  it("should prioritize --no-color over colors in config", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config=colors-true.webpack.config.js",
      "--no-color",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).not.toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
    expect(stdout).toContain("successfully");
  });

  it("should work in multi compiler mode", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config=multiple-configs.js",
      "--color",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("\u001B[1mfirst-config");
    expect(stdout).toContain("\u001B[1msecond-config");
    expect(stdout).toContain("\u001B[1m\u001B[32msuccessfully\u001B[39m\u001B[22m");
  });
});
