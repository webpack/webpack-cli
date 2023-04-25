"use strict";

const { run } = require("../../utils/test-utils");

describe("extends property", () => {
  it("extends a provided webpack config correctly", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname + "/simple-case");

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("base.webpack.config.js");
    expect(stdout).toContain("derived.webpack.config.js");
    expect(stdout).toContain("entry: './src/index.js'");
    expect(stdout).toContain("mode: 'development'");
  });

  it("extends a provided array of webpack configs correctly", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname + "/multiple-extends");

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("base1.webpack.config.js");
    expect(stdout).toContain("base2.webpack.config.js");
    expect(stdout).toContain("derived.webpack.config.js");
    expect(stdout).toContain("entry: './src/index2.js'");
    expect(stdout).toContain("mode: 'production'");
  });

  it("extends a multilevel config correctly", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname + "/multi-level-extends");
    console.log(stdout);

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("base1.webpack.config.js");
    expect(stdout).toContain("base2.webpack.config.js");
    expect(stdout).toContain("derived.webpack.config.js");
    expect(stdout).toContain("entry: './src/index1.js'");
    expect(stdout).toContain("mode: 'production'");
  });
});
