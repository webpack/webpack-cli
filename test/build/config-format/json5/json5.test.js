const { run } = require("../../../utils/test-utils");

// Regression test for an unsupported config format.
//
// `interpret` lists `.json5` (via `json5/lib/register`), but webpack-cli only
// runs `interpret`/`rechoir` for extensions present in `interpret.jsVariants`,
// which contains JS variants only (`.ts`, `.coffee`, `.babel.js`, ...) and not
// data formats such as `.json5`, `.yaml` or `.toml`. As a result a `.json5`
// config is not loadable today, even when `json5` is installed.
//
// This test locks in that behavior so the planned move away from `interpret`
// (towards Node.js' built-in loaders/`import`) does not silently change which
// formats are accepted without a deliberate decision.
describe("webpack cli", () => {
  it("should not support JSON5 file as flag", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.json5"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Failed to load 'webpack.config.json5' config");
    expect(stdout).toBeFalsy();
  });
});
