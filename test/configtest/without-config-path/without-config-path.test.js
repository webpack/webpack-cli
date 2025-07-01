"use strict";

const { normalizeStderr, normalizeStdout, run } = require("../../utils/test-utils");

describe("'configtest' command without the configuration path option", () => {
  it("should validate default configuration", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["configtest"]);

    expect(exitCode).toBe(0);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });
});
