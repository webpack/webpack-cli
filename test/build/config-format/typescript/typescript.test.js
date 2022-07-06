const { run } = require("../../../utils/test-utils");
const { existsSync, unlinkSync } = require("fs");
const { resolve } = require("path");

// eslint-disable-next-line node/no-unpublished-require
const execa = require("execa");
const { sync: spawnSync } = execa;

describe("webpack cli", () => {
  it("should support typescript file", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"]);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it('should work with the "config-registered" option from flags', async () => {
    const configFileName = "webpack.config";
    const configFilePath = resolve(__dirname, `${configFileName}.ts`);
    const buildScripts = spawnSync("yarn", ["tsc", configFilePath]);
    expect(buildScripts.stdout).toBeTruthy();

    const { exitCode, stderr, stdout } = await run(__dirname, ["--config-registered"]);
    unlinkSync(resolve(__dirname, `${configFileName}.js`));

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
