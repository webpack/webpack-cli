const { run } = require("../../../utils/test-utils");

// webpack-cli recognizes TOML config files through `interpret`/`rechoir` but,
// like the other non-JS formats, it does not ship the parser. When the required
// `toml-require` package is not installed, webpack-cli should not crash silently
// — it should tell the user which package to install. This pins that behavior
// (the parser is intentionally absent from the project's dependencies).
describe("webpack cli", () => {
  it("should ask to install the parser for a TOML file when it is missing", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.toml"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("toml-require");
    expect(stderr).toContain("Please install one of them");
    expect(stdout).toBeFalsy();
  });
});
