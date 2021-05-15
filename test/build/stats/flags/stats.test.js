"use strict";

const { run, isWebpack5, normalizeStderr, normalizeStdout } = require("../../../utils/test-utils");

const presets = ["normal", "detailed", "errors-only", "errors-warnings", "minimal", "verbose", "none"];

if (isWebpack5) {
    presets.push("summary");
}

describe("stats flag", () => {
    for (const preset of presets) {
        it(`should accept --stats "${preset}"`, async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, ["--stats", `${preset}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();

            if (isWebpack5) {
                expect(stdout).toContain(`preset: '${preset}'`);
            } else {
                switch (preset) {
                    case "normal":
                        expect(stdout).toContain("stats:");
                        break;
                    case "detailed":
                        expect(stdout).toContain("entrypoints: true");
                        expect(stdout).toContain("errorDetails: true");
                        break;
                    case "errors-only":
                        expect(stdout).toContain("all: false");
                        expect(stdout).toContain("errors: true");
                        break;
                    case "errors-warnings":
                        expect(stdout).toContain("all: false");
                        expect(stdout).toContain("errors: true");
                        expect(stdout).toContain("warnings: true");
                        break;
                    case "minimal":
                        expect(stdout).toContain("modules: true");
                        expect(stdout).toContain("maxModules: 0");
                        break;
                    case "verbose":
                        expect(stdout).toContain("logging: 'verbose'");
                        break;
                    case "none":
                        expect(stdout).toContain("all: false");
                        break;
                    default:
                        expect(stdout).toContain(`preset: '${preset}'`);
                }
            }
        });
    }

    it("should accept stats as boolean", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--stats"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain("preset: 'normal'");
        } else {
            expect(stdout).toContain("stats:");
        }
    });

    it("should accept --no-stats as boolean", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--no-stats"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain("preset: 'none'");
        } else {
            expect(stdout).toContain("all: false");
        }
    });

    it("should log error when an unknown flag stats value is passed", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--stats", "foo"]);

        expect(exitCode).toEqual(2);
        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });
});
