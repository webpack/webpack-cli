const { existsSync } = require("node:fs");
const { resolve } = require("node:path");

const { run } = require("../../../utils/test-utils");

// webpack-cli reads and parses YAML config files directly (without
// `interpret`), but it does not ship the parser. The `js-yaml` package has to
// be installed by the user (here it is available as a dev dependency) and is
// imported on demand to parse `.yaml`/`.yml` files.
describe("webpack cli", () => {
  it("should support YAML file as flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.yaml"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support YML file as flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.yml"]);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should load YAML file by default", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, []);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
