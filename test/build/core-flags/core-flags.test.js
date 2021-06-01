"use strict";

const { run } = require("../../utils/test-utils");

describe("core flags", () => {
    describe("boolean", () => {
        it("should set bail to true", async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, ["--bail"]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain("bail: true");
        });

        it("should set bail to false", async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, ["--no-bail"]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain("bail: false");
        });
    });

    describe("RegExp", () => {
        it("should ignore the warning emitted", async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [
                "--ignore-warnings",
                /Generated Warning/,
                "--config",
                "warning.config.js",
            ]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).not.toContain("Module Warning (from ./my-warning-loader.js):");
            expect(stdout).not.toContain("Generated Warning");
        });

        it("should reset options.ignoreWarnings", async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [
                "--ignore-warnings",
                /Generated Warning/,
                "--ignore-warnings-reset",
                "--config",
                "warning.config.js",
            ]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain("Module Warning (from ./my-warning-loader.js):");
            expect(stdout).toContain("Generated Warning");
        });

        it("should throw error for an invalid value", async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, ["--ignore-warnings", "abc"]);

            expect(exitCode).toBe(2);
            expect(stderr).toContain(`Invalid value 'abc' for the '--ignore-warnings' option`);
            expect(stderr).toContain(`Expected: 'regular expression (example: /ab?c*/)'`);
            expect(stdout).toBeFalsy();
        });
    });

    describe("reset", () => {
        it("should reset entry correctly", async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [
                "--entry-reset",
                "--entry",
                "./src/entry.js",
            ]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain("src/entry.js");
            expect(stdout).not.toContain("src/main.js");
        });

        it("should throw error if entry is an empty array", async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, ["--entry-reset"]);

            expect(exitCode).toBe(2);
            expect(stderr).toContain("Invalid configuration object");
            expect(stdout).toBeFalsy();
        });
    });
});
