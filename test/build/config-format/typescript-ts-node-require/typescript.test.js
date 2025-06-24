const { run } = require("../../../utils/test-utils");
const { existsSync } = require("node:fs");
const { resolve } = require("node:path");

describe("webpack cli", () => {
  it("should support typescript file", async () => {
    const [major, minor] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      env: { NODE_NO_WARNINGS: 1 },
      nodeOptions:
        major >= 22 && minor >= 6
          ? ["--no-experimental-strip-types", "--require=ts-node/register"]
          : ["--require=ts-node/register"],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
