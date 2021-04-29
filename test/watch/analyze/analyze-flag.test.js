"use strict";

const { runWatch, normalizeStderr, normalizeStdout } = require("../../utils/test-utils");

describe('"analyze" option', () => {
    it("should load webpack-bundle-analyzer plugin with --analyze flag", async () => {
        const { stderr, stdout } = await runWatch(__dirname, ["--analyze"], {
            killString: /Webpack Bundle Analyzer is started at/,
        });

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });
});
