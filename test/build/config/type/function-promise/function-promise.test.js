"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { cleanStderr, run } = require("../../../../utils/test-utils");

describe("function promise", () => {
  it("is able to understand a configuration file as a function", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      resolve(__dirname, "webpack.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "./binary/functor.js"))).toBeTruthy();
  });
});
