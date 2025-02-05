const { run } = require("../../../utils/test-utils");
const { existsSync } = require("fs");
const { resolve } = require("path");

describe("webpack cli", () => {
  it("should support typescript file", async () => {
    // This test is for https://nodejs.org/api/typescript.html#modules-typescript
    // By default this feature enabled only since v23.6.0
    // For old Node.js version it uses `typescript`
    // For v23.6.0+ Node.js version it uses built-in feature
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.cts"], {
      env: { NODE_NO_WARNINGS: 1 },
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
