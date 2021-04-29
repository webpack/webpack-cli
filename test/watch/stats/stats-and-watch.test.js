"use strict";

const { runWatch, normalizeStderr, normalizeStdout } = require("../../utils/test-utils");

describe("stats and watch", () => {
    it('should not log stats with the "none" value from the configuration', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ["-c", "./webpack.config.js"]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it('should not log stats with the "none" value from the configuration and multi compiler mode', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ["-c", "./multi-webpack.config.js"]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it('should log stats with the "normal" value in arguments', async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            "-c",
            "./webpack.config.js",
            "--stats",
            "normal",
        ]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });
});
