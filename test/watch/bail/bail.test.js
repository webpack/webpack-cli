"use strict";

const { runWatch, normalizeStderr, normalizeStdout } = require("../../utils/test-utils");

describe('"bail" option', () => {
    it('should not log warning in not watch mode without the "watch" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, ["-c", "watch-webpack.config.js"]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it('should not log warning without the "bail" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            "-c",
            "no-bail-webpack.config.js",
            "--watch",
        ]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it('should not log warning without the "bail" option', async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            "-c",
            "no-bail-webpack.config.js",
            "--watch",
        ]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it("should log warning in watch mode", async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            "-c",
            "bail-webpack.config.js",
            "--watch",
        ]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it("should log warning in watch mode", async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            "-c",
            "bail-and-watch-webpack.config.js",
        ]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it("should log warning in case of multiple compilers", async () => {
        const { stderr, stdout } = await runWatch(__dirname, ["-c", "multi-webpack.config.js"]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });
});
