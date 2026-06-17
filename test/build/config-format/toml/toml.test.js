const { run } = require("../../../utils/test-utils");

// webpack-cli reads and parses TOML config files directly (without `interpret`)
// but does not ship the parser. When the required `toml` package is not
// installed, webpack-cli should not crash opaquely — it should tell the user
// exactly which package to install. This pins that developer-experience
// behavior (the parser is intentionally absent from the project's
// dependencies).
describe("webpack cli", () => {
  it("should ask to install the parser for a TOML file when it is missing", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.toml"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("requires the 'toml' package");
    expect(stderr).toContain("npm install --save-dev toml");
    expect(stdout).toBeFalsy();
  });
});
