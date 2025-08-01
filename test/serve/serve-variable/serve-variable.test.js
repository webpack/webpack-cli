"use strict";

const path = require("node:path");
const getPort = require("get-port");
const { normalizeStderr, runWatch } = require("../../utils/test-utils");

const testPath = path.resolve(__dirname);

describe("serve variable", () => {
  let port;

  beforeEach(async () => {
    port = await getPort();
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
