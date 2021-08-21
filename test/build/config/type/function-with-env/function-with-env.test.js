"use strict";
const { existsSync } = require("fs");
const { resolve } = require("path");
const { run, readFile } = require("../../../../utils/test-utils");

describe("function configuration", () => {
  it("should throw when env is not supplied", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--env"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Error: Option '--env <value...>' argument missing");
    expect(stdout).toBeFalsy();
  });

  it("is able to understand a configuration file as a function", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--env", "isProd"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/prod.js"))).toBeTruthy();
  });

  it("is able to understand a configuration file as a function", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--env", "isDev"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/dev.js"))).toBeTruthy();
  });

  it("Supports passing string in env", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--env",
      "environment=production",
      "--env",
      "app.title=Luffy",
      "-c",
      "webpack.env.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/Luffy.js"))).toBeTruthy();
  });

  it("Supports long nested values in env", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--env",
      "file.name.is.this=Atsumu",
      "--env",
      "environment=production",
      "-c",
      "webpack.env.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/Atsumu.js"))).toBeTruthy();
  });

  it("Supports multiple equal in a string", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--env",
      "file=name=is=Eren",
      "--env",
      "environment=multipleq",
      "-c",
      "webpack.env.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/name=is=Eren.js"))).toBeTruthy();
  });

  it("Supports dot at the end", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--env",
      "name.=Hisoka",
      "--env",
      "environment=dot",
      "-c",
      "webpack.env.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/Hisoka.js"))).toBeTruthy();
  });

  it("Supports dot at the end", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--env",
      "name.",
      "--env",
      "environment=dot",
      "-c",
      "webpack.env.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/true.js"))).toBeTruthy();
  });

  it("Supports empty string", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--env", `foo=''`]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/empty-string.js"))).toBeTruthy();
  });

  it('Supports empty string with multiple "="', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--env", `foo=bar=''`]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/new-empty-string.js"))).toBeTruthy();
  });

  it('Supports env variable with "=" at the end', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--env", `foo=`]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/equal-at-the-end.js"))).toBeTruthy();
  });

  it("is able to understand multiple env flags", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--env",
      "isDev",
      "--env",
      "verboseStats",
      "--env",
      "envMessage",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // check that the verbose env is respected
    expect(stdout).toContain("LOG from webpack");

    let data;

    try {
      data = await readFile(resolve(__dirname, "./dist/dev.js"), "utf-8");
    } catch (error) {
      expect(error).toBe(null);
    }

    // check if the values from DefinePlugin make it to the compiled code
    expect(data).toContain("env message present");
  });

  it("is able to apply last flag with same name", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--env",
      "name.=foo",
      "--env",
      "name.=baz",
      "--env",
      "environment=dot",
      "-c",
      "webpack.env.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    // Should generate the appropriate files
    expect(existsSync(resolve(__dirname, "./dist/baz.js"))).toBeTruthy();
  });
});
