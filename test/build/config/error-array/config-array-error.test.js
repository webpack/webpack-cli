"use strict";

const { normalizeStderr, run } = require("../../../utils/test-utils");

describe("config with invalid array syntax", () => {
  it("should throw syntax error and exit with non-zero exit code when even 1 object has syntax error", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.js"]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot();
    expect(stdout).toBeFalsy();
  });
});
