"use strict";

const path = require("path");
// eslint-disable-next-line node/no-unpublished-require
const getPort = require("get-port");
const { runWatch, normalizeStderr, isDevServer4 } = require("../../utils/test-utils");

const testPath = path.resolve(__dirname);
const devServer4Test = isDevServer4 ? it : it.skip;

describe("serve with devServer in config", () => {
  let port;

  beforeEach(async () => {
    port = await getPort();
  });

  it("Should pick up the host and port from config", async () => {
    const { stdout, stderr } = await runWatch(testPath, ["serve"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
      expect(stdout).toContain("http://0.0.0.0:1234");
    }

    expect(stdout).toContain("main.js");
  });

  it("Port flag should override the config port", async () => {
    const { stdout, stderr } = await runWatch(testPath, ["serve", "--port", port]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

    if (isDevServer4) {
      expect(stdout).toContain("HotModuleReplacementPlugin");
    } else {
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
      expect(stdout).toContain(`http://0.0.0.0:${port}`);
    }

    expect(stdout).toContain("main.js");
  });

  devServer4Test("Passing hot flag works alongside other server config", async () => {
    const { stdout, stderr } = await runWatch(testPath, ["serve", "--port", port, "--hot"]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  devServer4Test(
    "works fine when no-hot flag is passed alongside other server config",
    async () => {
      const { stdout, stderr } = await runWatch(testPath, ["serve", "--port", port, "--no-hot"]);

      expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
      expect(stdout).not.toContain("HotModuleReplacementPlugin");
      expect(stdout).toContain("main.js");
    },
  );
});
