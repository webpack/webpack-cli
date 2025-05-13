// eslint-disable-next-line n/no-unpublished-require
const { run } = require("../../../utils/test-utils");
const { existsSync } = require("fs");
const { resolve } = require("path");

describe("webpack cli", () => {
  it("should support typescript esnext file", async () => {
    const [major, minor] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      env: {
        NODE_NO_WARNINGS: 1,
        // Due nyc logic
        WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: true,
      },
      // Fallback to `ts-node/esm` for old Node.js versions
      nodeOptions:
        major >= 22 && minor >= 6
          ? ["--no-experimental-strip-types"]
          : ["--experimental-loader=ts-node/esm"],
    });

    console.log(stderr);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
