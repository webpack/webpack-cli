const { run } = require("../../../utils/test-utils");

// Regression test for an unsupported config format.
//
// `interpret` lists `.toml` (via `toml-require`), but webpack-cli only runs
// `interpret`/`rechoir` for extensions present in `interpret.jsVariants`, which
// contains JS variants only (`.ts`, `.coffee`, `.babel.js`, ...) and not data
// formats such as `.toml`, `.yaml` or `.json5`. As a result a `.toml` config is
// not loadable today.
//
// This test locks in that behavior so the planned move away from `interpret`
// (towards Node.js' built-in loaders/`import`) does not silently change which
// formats are accepted without a deliberate decision.
describe("webpack cli", () => {
  it("should not support TOML file as flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.toml"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Failed to load 'webpack.config.toml' config");
    expect(stdout).toBeFalsy();
  });
});
