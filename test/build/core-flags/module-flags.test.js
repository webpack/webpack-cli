"use strict";

const {
    run,
    hyphenToUpperCase,
    normalizeStdout,
    getWebpackCliArguments,
} = require("../../utils/test-utils");
const moduleFlags = getWebpackCliArguments("module-");

describe("module config related flag", () => {
    for (const [name, value] of Object.entries(moduleFlags)) {
        // extract property name from flag name
        let property = name.split("module-")[1];

        if (property.includes("rules-") && property !== "rules-reset") {
            property = name.split("rules-")[1];
        }

        const propName = hyphenToUpperCase(property);

        if (
            value.configs.filter((config) => config.type === "boolean").length > 0 &&
            !name.includes("module-no-parse") &&
            !name.includes("module-parser-")
        ) {
            it(`should config --${name} correctly`, async () => {
                if (name.includes("-reset")) {
                    const { stderr, stdout } = await run(__dirname, [`--${name}`]);
                    const option = propName.split("Reset")[0];

                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(`${option}: []`);
                } else if (name.includes("rules-")) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain("sideEffects: 'flag'");
                } else if (name.startsWith("module-generator-")) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
                        `--module-generator-asset-emit`,
                        "--module-generator-asset-resource-emit",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(
                        "generator: { asset: { emit: true }, 'asset/resource': { emit: true } }",
                    );
                } else {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(`${propName}: true`);
                }
            });

            if (!name.endsWith("-reset")) {
                it(`should config --no-${name} correctly`, async () => {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();

                    if (name.includes("rules-")) {
                        expect(normalizeStdout(stdout)).toContain("sideEffects: false");
                    } else if (name.startsWith("module-generator-")) {
                        expect(normalizeStdout(stdout)).toContain("emit: false");
                    } else {
                        expect(normalizeStdout(stdout)).toContain(`${propName}: false`);
                    }
                });
            }
        }

        if (
            value.configs.filter((config) => config.type === "string").length > 0 &&
            !(name.includes("module-parser-") || name.startsWith("module-generator"))
        ) {
            it(`should config --${name} correctly`, async () => {
                if (name === "module-no-parse") {
                    const { stderr, stdout, exitCode } = await run(__dirname, [
                        `--${name}`,
                        "value",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain("value");
                } else if (name.includes("reg-exp")) {
                    const { stdout, stderr, exitCode } = await run(__dirname, [
                        `--${name}`,
                        "/ab?c*/",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(`${propName}: /ab?c*/`);
                } else if (name.includes("module-rules-")) {
                    if (propName === "use" || propName === "type") {
                        const { stdout } = await run(__dirname, [`--${name}`, "javascript/auto"]);

                        expect(normalizeStdout(stdout)).toContain(`${propName}: 'javascript/auto'`);
                    } else if (property.includes("use-")) {
                        const { stdout } = await run(__dirname, [
                            "--module-rules-use-loader",
                            "myLoader",
                        ]);
                        expect(normalizeStdout(stdout)).toContain(`use: [Object]`);
                    } else if (propName === "enforce") {
                        const { stdout } = await run(__dirname, [
                            `--${name}`,
                            "pre",
                            "--module-rules-use-loader",
                            "myLoader",
                        ]);
                        expect(normalizeStdout(stdout)).toContain(`${propName}: 'pre'`);
                    } else if (name.includes("compiler")) {
                        const { stdout } = await run(__dirname, [`--${name}`, "test-compiler"]);
                        if (name.endsWith("-not")) {
                            expect(normalizeStdout(stdout)).toContain(`compiler: [Object]`);
                        } else {
                            expect(normalizeStdout(stdout)).toContain(
                                `${propName}: 'test-compiler'`,
                            );
                        }
                    } else if (name.includes("issuer-layer")) {
                        const { stdout } = await run(__dirname, [`--${name}`, "test-layer"]);
                        if (name.endsWith("-not")) {
                            expect(normalizeStdout(stdout)).toContain(`issuerLayer: [Object]`);
                        } else {
                            expect(normalizeStdout(stdout)).toContain(`${propName}: 'test-layer'`);
                        }
                    } else if (name.includes("dependency")) {
                        const { stdout } = await run(__dirname, [`--${name}`, "test-dep"]);
                        if (name.endsWith("-not")) {
                            expect(normalizeStdout(stdout)).toContain(`dependency: [Object]`);
                        } else {
                            expect(normalizeStdout(stdout)).toContain(`${propName}: 'test-dep'`);
                        }
                    } else if (name.includes("resource-fragment")) {
                        const { stdout } = await run(__dirname, [`--${name}`, "test-fragment"]);
                        if (name.endsWith("-not")) {
                            expect(normalizeStdout(stdout)).toContain(`resourceFragment: [Object]`);
                        } else {
                            expect(normalizeStdout(stdout)).toContain(
                                `${propName}: 'test-fragment'`,
                            );
                        }
                    } else if (name.includes("resource-query")) {
                        const { stdout } = await run(__dirname, [`--${name}`, "test-query"]);
                        if (name.endsWith("-not")) {
                            expect(normalizeStdout(stdout)).toContain(`resourceQuery: [Object]`);
                        } else {
                            expect(normalizeStdout(stdout)).toContain(`${propName}: 'test-query'`);
                        }
                    } else if (name.includes("mimetype")) {
                        const { stdout } = await run(__dirname, [`--${name}`, "test-mime"]);
                        if (name.endsWith("-not")) {
                            expect(normalizeStdout(stdout)).toContain(`mimetype: [Object]`);
                        } else {
                            expect(normalizeStdout(stdout)).toContain(`${propName}: 'test-mime'`);
                        }
                    } else {
                        const { stdout } = await run(__dirname, [`--${name}`, "/rules-value"]);
                        expect(normalizeStdout(stdout)).toContain("rules-value");
                    }
                } else {
                    const { stderr, stdout, exitCode } = await run(__dirname, [
                        `--${name}`,
                        "value",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(normalizeStdout(stdout)).toContain(`${propName}: 'value'`);
                }
            });
        }
    }

    it("should config module.generator flags corectly", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--module-generator-asset-data-url-encoding",
            "base64",
            "--module-generator-asset-data-url-mimetype",
            "application/node",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(normalizeStdout(stdout)).toContain(`generator: { asset: { dataUrl: [Object] } }`);
    });

    it("should config module.parser flags correctly", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--module-parser-javascript-browserify",
            "--module-parser-javascript-commonjs",
            "--module-parser-javascript-harmony",
            "--module-parser-javascript-import",
            "--no-module-parser-javascript-node",
            "--module-parser-javascript-require-include",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(normalizeStdout(stdout)).toContain("browserify: true");
        expect(normalizeStdout(stdout)).toContain("commonjs: true");
        expect(normalizeStdout(stdout)).toContain("harmony: true");
        expect(normalizeStdout(stdout)).toContain("import: true");
        expect(normalizeStdout(stdout)).toContain("node: false");
    });

    it("should accept --module-parser-javascript-url=relative", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--module-parser-javascript-url",
            "relative",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(normalizeStdout(stdout)).toContain(`url: 'relative'`);
    });

    it("should throw an error for an invalid value of --module-parser-javascript-url", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--module-parser-javascript-url",
            "test",
        ]);

        expect(exitCode).toBe(2);
        expect(normalizeStdout(stderr)).toContain(
            `Invalid value 'test' for the '--module-parser-javascript-url' option`,
        );
        expect(normalizeStdout(stderr)).toContain(`Expected: 'relative'`);
        expect(stdout).toBeFalsy();
    });
});
