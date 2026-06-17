const { existsSync } = require("node:fs");
const { resolve } = require("node:path");

const { run } = require("../../../utils/test-utils");

// webpack-cli supports YAML config files through `interpret`/`rechoir`, but it
// does not ship the parser. The `yaml-hook` package has to be installed by the
// user (here it is available as a dev dependency) and `yaml-hook/register` is
// loaded on demand to register the `.yaml`/`.yml` extensions.
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
