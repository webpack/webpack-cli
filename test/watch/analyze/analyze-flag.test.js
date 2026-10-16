"use strict";

const { cleanStderr, runWatch } = require("../../utils/test-utils");

describe('"analyze" option', () => {
  it("should load webpack-bundle-analyzer plugin with --analyze flag", async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["--analyze"], {
      killString: /Webpack Bundle Analyzer is started at/,
    });

    expect(cleanStderr(stderr)).toBeFalsy();
    // webpack-bundle-analyzer moved its messages between stdout and stderr across releases,
    // so look for them in both
    expect(`${stdout}\n${stderr}`).toContain("Webpack Bundle Analyzer is started at");
  });
});
