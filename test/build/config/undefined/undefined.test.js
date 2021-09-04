"use strict";
const { resolve } = require("path");
const { run } = require("../../../utils/test-utils");

describe("config flag with undefined export config file", () => {
  it("should throw error with no configuration or index file", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.js"),
    ]);

    console.log({ stdout, stderr, exitCode });

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });
});
