// eslint-disable-next-line n/no-unpublished-require
const { run } = require("../../../utils/test-utils");
const { existsSync } = require("fs");
const { resolve } = require("path");

describe("webpack cli", () => {
  it("should support typescript esnext file", async () => {
    const [major, minor] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.mts"], {
      env: { NODE_NO_WARNINGS: 1 },
      // Fallback to `ts-node/esm` for old Node.js versions
      nodeOptions: major >= 22 && minor >= 6 ? [] : ["--experimental-loader=ts-node/esm"],
    });

    expect(stderr).toBeFalsy(); // Deprecation warning logs on stderr
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
