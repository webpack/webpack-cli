"use strict";

const { run, readFile } = require("../../utils/test-utils");
const { resolve, join } = require("path");
const { existsSync } = require("fs");

const assertNoErrors = (exitCode, stderr, stdout, testDir, buildPath = "dist") => {
  expect(exitCode).toBe(0);
  expect(stderr).toBeFalsy();
  expect(stdout).toBeTruthy();
  expect(stdout).not.toContain("ERROR");
  expect(existsSync(resolve(testDir, join(buildPath, "main.js")))).toBeTruthy();
};

const getBuildOutput = async (testDir, buildPath = "dist") => {
  try {
    return readFile(resolve(testDir, join(buildPath, "main.js")), "utf-8");
  } catch (error) {
    expect(error).toBe(null);
  }
};

describe("dotenv-webpack-plugin", () => {
  it("reads .env file and defines variables correctly", async () => {
    const testDir = join(__dirname, "builtin-config");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain("value1");
    expect(data).toContain("value2");
  });

  it("reads .env.production file and overrides values from .env variables correctly", async () => {
    const testDir = join(__dirname, "overrides-config");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:",production_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:",production_value');
  });

  it("reads .env file and does not define a variable when it does not start with PUBLIC_", async () => {
    const testDir = join(__dirname, "non-webpack-variable");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.NON_PUBLIC_VARIABLE:",process.env.NON_PUBLIC_VARIABLE');
    expect(data).toContain('"import.meta.env.NON_PUBLIC_VARIABLE:",(void 0).NON_PUBLIC_VARIABLE');
    expect(data).not.toContain("variable_value");
  });

  it("reads .env.production when mode is set to production", async () => {
    const testDir = join(__dirname, "mode-production");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
      "--mode",
      "production",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:",production_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:",production_value');
    expect(data).not.toContain("default_value");
    expect(data).not.toContain("development_value");
  });

  it("reads .env.development when mode is set to development", async () => {
    const testDir = join(__dirname, "mode-development");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
      "--mode",
      "development",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    // TODO check why webpack adds "\\" to the value only in development mode
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:\\", development_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:\\", development_value');
    expect(data).not.toContain("default_value");
    expect(data).not.toContain("production_value");
  });

  it("reads .env.none when mode is set to none", async () => {
    const testDir = join(__dirname, "mode-none");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
      "--mode",
      "none",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:", none_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:", none_value');
    expect(data).not.toContain("default_value");
    expect(data).not.toContain("production_value");
    expect(data).not.toContain("development_value");
  });

  it("reads .env.example when file is present", async () => {
    const testDir = join(__dirname, "env-example");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:",example_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:",example_value');
  });

  it("overrides value from .env when same key in .env.local is present", async () => {
    const testDir = join(__dirname, "overrides-local");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:",local_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:",local_value');
    expect(data).not.toContain("default_value");
  });

  it("overrides value from .env.[mode] when same key in .env.[mode].local is present", async () => {
    const testDir = join(__dirname, "overrides-local");
    const { exitCode, stderr, stdout } = await run(testDir, [
      "--entry",
      "./src/index.js",
      "--read-dot-env",
    ]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:",local_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:",local_value');
    expect(data).not.toContain("production_value");
  });

  it("reads .env file and applies for all configs", async () => {
    const testDir = join(__dirname, "multiple-configs");
    const { exitCode, stderr, stdout } = await run(testDir, ["--read-dot-env"]);

    assertNoErrors(exitCode, stderr, stdout, testDir, "dist1");

    let data = await getBuildOutput(testDir, "dist1");

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:",default_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:",default_value');

    data = await getBuildOutput(testDir, "dist2");

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:",default_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:",default_value');
  });

  it("reads env vars from a custom file path correctly", async () => {
    const testDir = join(__dirname, "custom-config-path");
    const { exitCode, stderr, stdout } = await run(testDir);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"process.env.PUBLIC_VARIABLE:",default_value');
    expect(data).toContain('"import.meta.env.PUBLIC_VARIABLE:",default_value');
  });

  it("creates variables with custom prefixes when passed", async () => {
    const testDir = join(__dirname, "custom-prefix");
    const { exitCode, stderr, stdout } = await run(testDir);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain('"custom_prefix_PUBLIC_VARIABLE:",default_value');
  });

  it("validates env files paths", async () => {
    const testDir = join(__dirname, "validate-config-paths");
    const { stderr } = await run(testDir);

    expect(stderr).toContain("options.envFiles should be an array");
  });

  it("validates custom prefixes", async () => {
    const testDir = join(__dirname, "validates-prefixes");
    const { stderr } = await run(testDir);

    expect(stderr).toContain("options.prefixes should be an array");
  });

  it("uses the passed env var prefix correctly", async () => {
    const testDir = join(__dirname, "env-var-prefix");
    const { exitCode, stderr, stdout } = await run(testDir, ["--read-dot-env"]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain("default_value");
  });

  it("overrides the variables according to priority order correctly", async () => {
    const testDir = join(__dirname, "priority-order");
    const { exitCode, stderr, stdout } = await run(testDir, ["--read-dot-env"]);

    assertNoErrors(exitCode, stderr, stdout, testDir);

    const data = await getBuildOutput(testDir);

    expect(data).toContain("Hello from index.js");
    expect(data).toContain(`"process.env.PUBLIC_EXAMPLE_VARIABLE:",public_example_value_override`);
    expect(data).toContain(`"process.env.PUBLIC_ENV_VARIABLE:",public_env_value_override`);
    expect(data).toContain(
      `"process.env.PUBLIC_ENV_MODE_VARIABLE:",public_env_mode_value_override`,
    );
    expect(data).toContain(
      `"process.env.PUBLIC_ENV_LOCAL_VARIABLE:",public_env_local_value_override`,
    );
  });

  it("throws an error if custom env file path is passed and file could not be read", async () => {
    const testDir = join(__dirname, "validates-file-exists");
    const { stdout } = await run(testDir);

    expect(stdout).toContain("Could not read ./env.custom");
  });

  it("throws an error if empty value is passed for an environment variable", async () => {
    const testDir = join(__dirname, "validates-empty-value");
    const { stdout } = await run(testDir);

    expect(stdout).toContain(
      "Environment variables cannot have an empty value. The following variables are empty: PUBLIC_VARIABLE, PUBLIC_VARIABLE2",
    );
  });

  it("does not throw an error if empty value is passed for an environment variable and allowEmptyValues is set to true", async () => {
    const testDir = join(__dirname, "allow-empty-values");
    const { exitCode, stderr, stdout } = await run(testDir);

    assertNoErrors(exitCode, stderr, stdout, testDir);
  });
});
