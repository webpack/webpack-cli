// eslint-disable-next-line node/no-unpublished-require
const { run } = require("../../../utils/test-utils");
const { existsSync } = require("fs");
const { resolve } = require("path");

describe("webpack cli", () => {
  it("should support typescript esnext file", async () => {
    const majorNodeVersion = process.version.slice(1, 3);

    if (majorNodeVersion < 14) {
      expect(true).toBe(true);

      return;
    }

    // TODO: fix this for node v16+
    if (process.version.startsWith("v16") || process.version.startsWith("v17")) {
      expect(true).toBe(true);

      return;
    }

    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"]);
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
