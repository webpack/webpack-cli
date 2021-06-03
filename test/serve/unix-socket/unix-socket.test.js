"use strict";

const os = require("os");
const { resolve } = require("path");

const { run, runWatch, normalizeStderr, normalizeStdout } = require("../../utils/test-utils");

const testPath = resolve(__dirname);
const unixSocketPath = resolve(os.tmpdir(), "webpack-dev-server");

describe("--unix-socket", () => {
    it("should default unix socket to <tmpDir>/webpack-dev-server", async () => {
        const { stderr, stdout } = await runWatch(testPath, ["serve", "--unix-socket"]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(stdout).toContain(`Listening to socket at ${unixSocketPath}`);
    });

    it("--unix-socket <value>", async () => {
        const { stderr, stdout } = await runWatch(testPath, [
            "serve",
            "--unix-socket",
            "./webpack.sock",
        ]);

        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(stdout).toContain("Listening to socket at ./webpack.sock");
    });

    it("should throw error if `--unix-socket` is used without serve command", async () => {
        const { exitCode, stderr, stdout } = await run(testPath, ["--unix-socket"]);

        expect(exitCode).toBe(2);
        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });
});
