"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { readFile, run } = require("../../../utils/test-utils");

describe("multiple entries", () => {
  it("should allow multiple entry flags", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--entry",
      "./src/a.js",
      "--entry",
      "./src/b.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./dist/main.js"))).toBeTruthy();

    let data;

    try {
      data = await readFile(resolve(__dirname, "./dist/main.js"), "utf8");
    } catch (error) {
      expect(error).toBeNull();
    }

    expect(data).toContain("Hello from a.js");
    expect(data).toContain("Hello from b.js");
  });
});
