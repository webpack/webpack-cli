const { run } = require("../../../utils/test-utils");

describe("webpack cli", () => {
  it("should support mjs config format", async () => {
    const { exitCode, stderr } = await run(__dirname, ["-c", "webpack.config.mjs"]);

    console.log(stderr);

    expect(exitCode).toBe(2);
    expect(stderr).toMatch(/Unable to find default export./);
  });
});
