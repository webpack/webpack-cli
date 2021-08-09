"use strict";

const { run } = require("../../utils/test-utils");

describe("extends", () => {
    it("should use webpack.config.js and use all extended configs", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, []);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("webpack.config.js");
        expect(stdout).toContain("first-webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
    });

    it("should use multi-extended.config.js and use all extended configs", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./multi-extended.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("multi-extended.config.js");
        expect(stdout).toContain("one.webpack.config.js");
        expect(stdout).toContain("two.webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
    });

    it("should use extend configuration with --extends flag", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./simple-webpack.config.js",
            "--extends",
            "./first-webpack.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("simple-webpack.config.js");
        expect(stdout).toContain("first-webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
    });

    it("should use extend multiple configurations with --extends flag", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./simple-webpack.config.js",
            "--extends",
            "./one.webpack.config.js",
            "--extends",
            "./two.webpack.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("simple-webpack.config.js");
        expect(stdout).toContain("one.webpack.config.js");
        expect(stdout).toContain("two.webpack.config.js");
    });

    it("should work in multi compiler mode", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./multi-compiler.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        // config names
        expect(stdout).toContain("multi-compiler.config.js");
        expect(stdout).toContain("webpack.config.js");
        expect(stdout).toContain("first-webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
        // compiler names
        expect(stdout).toContain("first-compiler");
        expect(stdout).toContain("second-compiler");
    });

    it("should work in multi compiler mode with --config-name", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./multi-compiler.config.js",
            "--config-name",
            "second-compiler",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        // config names
        expect(stdout).toContain("multi-compiler.config.js");
        expect(stdout).toContain("webpack.config.js");
        expect(stdout).toContain("first-webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
        // compiler names
        expect(stdout).not.toContain("first-compiler");
        expect(stdout).toContain("second-compiler");
    });

    it("should work with multiple --config flags", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./simple-webpack.config.js",
            "--config",
            "./webpack.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("simple-webpack.config.js");
        expect(stdout).toContain("webpack.config.js");
        expect(stdout).toContain("first-webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
    });

    it("should work with multiple --merge flag", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./simple-webpack.config.js",
            "--config",
            "./second-webpack.config.js",
            "--merge",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("simple-webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
    });

    it("should use extend multiple configurations with --extends flag #2", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./simple-webpack.config.js",
            "--extends",
            "./one.webpack.config.js",
            "--extends",
            "./two.webpack.config.js",
            "--extends",
            "./second-webpack.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("simple-webpack.config.js");
        expect(stdout).toContain("one.webpack.config.js");
        expect(stdout).toContain("two.webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
    });

    it("should use extend configuration with -e alias", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./simple-webpack.config.js",
            "-e",
            "./first-webpack.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("simple-webpack.config.js");
        expect(stdout).toContain("first-webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
    });

    it("should use extend multiple configurations with -e alias", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./simple-webpack.config.js",
            "-e",
            "./one.webpack.config.js",
            "-e",
            "./two.webpack.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("simple-webpack.config.js");
        expect(stdout).toContain("one.webpack.config.js");
        expect(stdout).toContain("two.webpack.config.js");
    });

    it("should use extend multiple configurations with -e alias #2", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./simple-webpack.config.js",
            "--extends",
            "./one.webpack.config.js",
            "--extends",
            "./two.webpack.config.js",
            "--extends",
            "./second-webpack.config.js",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("simple-webpack.config.js");
        expect(stdout).toContain("one.webpack.config.js");
        expect(stdout).toContain("two.webpack.config.js");
        expect(stdout).toContain("second-webpack.config.js");
        expect(stdout).toContain("third-webpack.config.js");
    });

    it("should throw an error for invalid-extend.config.js", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--config",
            "./invalid-extend.config.js",
        ]);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Error: Cannot find module`);
        expect(stdout).toBeFalsy();
    });
});
