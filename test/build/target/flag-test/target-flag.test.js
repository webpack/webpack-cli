"use strict";
const { run, normalizeStdout, normalizeStderr } = require("../../../utils/test-utils");

const targetValues = [
  "web",
  "webworker",
  "node",
  "async-node",
  "node-webkit",
  "electron-main",
  "electron-renderer",
  "electron-preload",
];

describe("--target flag", () => {
  targetValues.forEach((val) => {
    it(`should accept ${val} with --target flag`, async () => {
      const { exitCode, stderr, stdout } = await run(__dirname, ["--target", `${val}`]);

      expect(exitCode).toBe(0);
      expect(stderr).toBeFalsy();
      expect(stdout).toContain(`target: [ '${val}' ]`);
    });

    it(`should accept ${val} with -t alias`, async () => {
      const { exitCode, stderr, stdout } = await run(__dirname, ["-t", `${val}`]);

      expect(exitCode).toBe(0);
      expect(stderr).toBeFalsy();
      expect(stdout).toContain(`target: [ '${val}' ]`);
    });
  });

  it(`should throw error with invalid value for --target`, async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--target", "invalid"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should allow multiple targets", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--target",
      "node",
      "--target",
      "async-node",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain(`target: [ 'node', 'async-node' ]`);
  });

  it("should throw an error for invalid target in multiple syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--target",
      "node",
      "--target",
      "invalid",
    ]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should throw an error for incompatible multiple targets", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--target",
      "node",
      "--target",
      "web",
    ]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should allow multiple targets", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--target",
      "node",
      "--target",
      "async-node",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain(`target: [ 'node', 'async-node' ]`);
  });

  it("should throw an error for invalid target in multiple syntax", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--target",
      "node",
      "--target",
      "invalid",
    ]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should throw an error for incompatible multiple targets", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--target",
      "node",
      "--target",
      "web",
    ]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it("should reset target from node to async-node with --target-reset", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--target-reset",
      "--target",
      "async-node",
    ]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain(`target: [ 'async-node' ]`);
  });

  it("should throw error if target is an empty array", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--target-reset"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });
});
