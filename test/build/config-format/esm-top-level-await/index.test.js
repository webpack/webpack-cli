const { run } = require("../../../utils/test-utils");

describe("webpack cli", () => {
  it("should support mjs config format using `require`", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.mjs"]);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
  });
});
