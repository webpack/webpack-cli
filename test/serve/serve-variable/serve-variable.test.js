"use strict";

const path = require("node:path");
const { normalizeStderr, runWatch } = require("../../utils/test-utils");

const getGetPort = () => import("get-port");

const testPath = path.resolve(__dirname);

describe("serve variable", () => {
  let port;

  beforeEach(async () => {
    port = await (await getGetPort()).default();
  });

  it("compiles without flags and export variable", async () => {
    const { stdout, stderr } = await runWatch(testPath, ["serve", "--port", port], {
      stdoutKillStr: /webpack \d+\.\d+\.\d/,
      stderrKillStr: /Content not from webpack is served from/,
    });

    expect(normalizeStderr(stderr)).toMatchSnapshot();
    expect(stdout).toContain("main.js");
    expect(stdout).toContain("PASS");
  });
});
