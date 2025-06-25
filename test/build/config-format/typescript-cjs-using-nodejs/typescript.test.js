const { run } = require("../../../utils/test-utils");
const { existsSync } = require("node:fs");
const { resolve } = require("node:path");

describe("webpack cli", () => {
  it("should support typescript esnext file", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["-c", "./webpack.config.ts", "--disable-interpret"],
      {
        env: {
          NODE_NO_WARNINGS: 1,
          // Due nyc logic
          WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: true,
        },
        // Fallback to `ts-node/esm` for old Node.js versions
        nodeOptions: major >= 24 ? [] : ["--experimental-loader=ts-node/esm"],
      },
    );

    expect(stderr).toBeFalsy(); // Deprecation warning logs on stderr
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
