"use strict";

const {
    run,
    runAndGetProcess,
    isWebpack5,
    processKill,
    normalizeStderr,
    normalizeStdout,
} = require("../../utils/test-utils");
const { writeFileSync } = require("fs");
const { resolve } = require("path");

const wordsInStatsv4 = ["Hash", "Built at:", "main.js"];
const wordsInStatsv5 = ["asset", "index.js", "compiled successfully"];

describe("basic", () => {
    it("should work with negative value", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "-c",
            "./watch.config.js",
            "--no-watch",
        ]);

        expect(exitCode).toBe(0);
        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it("should recompile upon file change using the `--watch` option", (done) => {
        const proc = runAndGetProcess(__dirname, ["--watch", "--mode", "development"]);

        let modified = false;

        proc.stdout.on("data", (chunk) => {
            const data = chunk.toString();

            if (data.includes("index.js")) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified) {
                    process.nextTick(() => {
                        writeFileSync(
                            resolve(__dirname, "./src/index.js"),
                            `console.log('watch flag test');\n`,
                        );
                    });

                    modified = true;
                } else {
                    processKill(proc);
                    done();
                }
            }
        });
    });

    it("should recompile upon file change using the `watch` command", (done) => {
        const proc = runAndGetProcess(__dirname, ["watch", "--mode", "development"]);

        let modified = false;

        proc.stdout.on("data", (chunk) => {
            const data = chunk.toString();

            if (data.includes("index.js")) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified) {
                    process.nextTick(() => {
                        writeFileSync(
                            resolve(__dirname, "./src/index.js"),
                            `console.log('watch flag test');\n`,
                        );
                    });

                    modified = true;
                } else {
                    processKill(proc);
                    done();
                }
            }
        });
    });

    it("should recompile upon file change using the `watch` command and entries syntax", (done) => {
        const proc = runAndGetProcess(__dirname, [
            "watch",
            "./src/entry.js",
            "--mode",
            "development",
        ]);

        let modified = false;

        const wordsInStatsv5Entries = ["asset", "entry.js", "compiled successfully"];

        proc.stdout.on("data", (chunk) => {
            const data = chunk.toString();

            if (data.includes("entry.js")) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5Entries) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified) {
                    process.nextTick(() => {
                        writeFileSync(
                            resolve(__dirname, "./src/entry.js"),
                            `console.log('watch flag test');\n`,
                        );
                    });

                    modified = true;
                } else {
                    processKill(proc);
                    done();
                }
            }
        });
    });

    it("should log warning about the `watch` option in the configuration and recompile upon file change using the `watch` command", (done) => {
        const proc = runAndGetProcess(__dirname, [
            "--watch",
            "--mode",
            "development",
            "--config",
            "./watch.config.js",
        ]);

        let modified = false;

        proc.stdout.on("data", (chunk) => {
            const data = chunk.toString();

            if (data.includes("index.js")) {
                if (isWebpack5) {
                    for (const word of wordsInStatsv5) {
                        expect(data).toContain(word);
                    }
                } else {
                    for (const word of wordsInStatsv4) {
                        expect(data).toContain(word);
                    }
                }

                if (!modified) {
                    process.nextTick(() => {
                        writeFileSync(
                            resolve(__dirname, "./src/index.js"),
                            `console.log('watch flag test');\n`,
                        );
                    });

                    modified = true;
                } else {
                    processKill(proc);
                    done();
                }
            }
        });

        proc.stderr.on("data", (chunk) => {
            const data = chunk.toString();

            expect(data).toContain(
                "No need to use the 'watch' command together with '{ watch: true }' configuration, it does not make sense.",
            );
        });
    });

    it("should log supplied config with watch", (done) => {
        const proc = runAndGetProcess(__dirname, ["watch", "--config", "log.config.js"]);

        let stderr = "";

        proc.stderr.on("data", (chunk) => {
            const data = chunk.toString();

            stderr += data;

            if (/Compiler finished/.test(data)) {
                expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");

                processKill(proc);
                done();
            }
        });
    });

    it("should recompile upon file change using the `command` option and the `--watch` option and log warning", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "watch",
            "--watch",
            "--mode",
            "development",
        ]);

        expect(exitCode).toBe(2);
        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });

    it("should recompile upon file change using the `command` option and the `--no-watch` option and log warning", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "watch",
            "--no-watch",
            "--mode",
            "development",
        ]);

        expect(exitCode).toBe(2);
        expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
        expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
    });
});
