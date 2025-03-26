const { run } = require("../../../utils/test-utils");

describe("webpack cli", () => {
  it("should support mjs config format using `require`", async () => {
    const { exitCode, stdout } = await run(__dirname, ["-c", "webpack.config.js"]);

    const [major, minor] = process.versions.node.split(".").map(Number);

    if ((major >= 20 && minor >= 17) || major >= 22 || major >= 23) {
      expect(exitCode).toBe(0);
      // stderr contains - Support for loading ES Module in require() is an experimental feature and might change at any time
      // expect(stderr).toBeFalsy();
      expect(stdout).toBeTruthy();
    } else {
      expect(exitCode).toBe(2);
    }
  });
});
