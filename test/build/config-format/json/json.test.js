const { existsSync } = require("node:fs");
const { resolve } = require("node:path");

const { run } = require("../../../utils/test-utils");

describe("webpack cli", () => {
  it("should support JSON file as flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.json"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should load JSON file by default", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, []);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
