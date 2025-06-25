"use strict";

const { run, readFile } = require("../../utils/test-utils");
const { resolve } = require("node:path");

describe("errors", () => {
  it("should output by default", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname);

    expect(exitCode).toBe(1);
    expect(stderr).toBeFalsy();
    expect(stdout).toMatch(/ERROR/);
    expect(stdout).toMatch(/Error: Can't resolve/);
  });

  it('should output JSON with the "json" flag', async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--json"]);

    expect(exitCode).toBe(1);
    expect(stderr).toBeFalsy();
    expect(() => JSON.parse(stdout)).not.toThrow();

    const json = JSON.parse(stdout);

    expect(json.hash).toBeDefined();
    expect(json.errors).toHaveLength(1);
    expect(json.errors[0].message).toMatch(/Can't resolve/);
  });

  it("should store json to a file", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["--json", "stats.json"]);

    expect(exitCode).toBe(1);
    expect(stderr).toContain("stats are successfully stored as json to stats.json");
    expect(stdout).toBeFalsy();

    let data;

    try {
      data = await readFile(resolve(__dirname, "stats.json"), "utf8");
    } catch (error) {
      expect(error).toBeNull();
    }

    expect(() => JSON.parse(data)).not.toThrow();

    const json = JSON.parse(data);

    expect(json.hash).toBeDefined();
    expect(json.errors).toHaveLength(1);
    expect(json.errors[0].message).toMatch(/Can't resolve/);
  });
});
