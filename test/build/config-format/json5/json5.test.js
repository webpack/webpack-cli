const { existsSync } = require("node:fs");
const { resolve } = require("node:path");

const { run } = require("../../../utils/test-utils");

// webpack-cli reads and parses JSON5 config files directly (without
// `interpret`), but it does not ship the parser. The `json5` package has to be
// installed by the user (here it is available as a dev dependency) and is
// imported on demand to parse `.json5` files.
describe("webpack cli", () => {
  it("should support JSON5 file as flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.json5"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should load JSON5 file by default", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, []);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
