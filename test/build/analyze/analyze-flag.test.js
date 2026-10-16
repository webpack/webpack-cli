"use strict";

const { cleanStderr, normalizeStdout, run } = require("../../utils/test-utils");

describe('"analyze" option', () => {
  it("should not load webpack-bundle-analyzer plugin twice with --analyze flag and plugin", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./analyze.config.js",
      "--analyze",
    ]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();

    // webpack-bundle-analyzer moved its messages between stdout and stderr across releases,
    // so look for them in both
    const output = normalizeStdout(`${stdout}\n${stderr}`);

    expect(output.match(/Webpack Bundle Analyzer saved report to/g)).toHaveLength(1);
  });
});
