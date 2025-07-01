const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { run } = require("../../../utils/test-utils");

describe("webpack cli", () => {
  it("should support typescript esnext file", async () => {
    const [major, minor] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      env: {
        NODE_NO_WARNINGS: 1,
        // Due nyc logic
        WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: true,
      },
      nodeOptions:
        major >= 22 && minor >= 6
          ? ["--no-experimental-strip-types", "--experimental-loader=ts-node/esm"]
          : ["--experimental-loader=ts-node/esm"],
    });

    expect(stderr).toBeFalsy(); // Deprecation warning logs on stderr
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
