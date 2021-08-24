"use strict";

const { resolve } = require("path");
const { run } = require("../../../utils/test-utils");

describe("no configs in array", () => {
  it("is able to understand and parse a very basic configuration file", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeFalsy();
  });
});
