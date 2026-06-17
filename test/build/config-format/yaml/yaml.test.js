const { run } = require("../../../utils/test-utils");

// Regression test for an unsupported config format.
//
// `interpret` lists `.yaml`/`.yml` (via `yaml-hook/register`), but webpack-cli
// only runs `interpret`/`rechoir` for extensions present in
// `interpret.jsVariants`, which contains JS variants only (`.ts`, `.coffee`,
// `.babel.js`, ...) and not data formats such as `.yaml`, `.yml`, `.json5` or
// `.toml`. As a result YAML configs are not loadable today.
//
// This test locks in that behavior so the planned move away from `interpret`
// (towards Node.js' built-in loaders/`import`) does not silently change which
// formats are accepted without a deliberate decision.
describe("webpack cli", () => {
  it("should not support YAML file as flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.yaml"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Failed to load 'webpack.config.yaml' config");
    expect(stdout).toBeFalsy();
  });

  it("should not support YML file as flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.yml"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Failed to load 'webpack.config.yml' config");
    expect(stdout).toBeFalsy();
  });
});
