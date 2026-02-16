"use strict";

const { resolve } = require("node:path");
const { run } = require("../../../utils/test-utils");

describe("config flag with undefined default export config file", () => {
  it("should not throw error with no configuration or index file", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toMatch(/Default export is missing or nullish at/);
    expect(stdout).toBeTruthy();
  });
});
