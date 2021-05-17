"use strict";

const { run, hyphenToUpperCase, getWebpackCliArguments } = require("../../utils/test-utils");
const optimizationFlags = getWebpackCliArguments("optimization-");

describe("optimization config related flag", () => {
    for (const [name, value] of Object.entries(optimizationFlags)) {
        // extract property name from flag name
        let property = name.split("optimization-")[1];

        if (name.includes("split-chunks")) {
            property = name.split("optimization-split-chunks-")[1];
        }

        let propName = hyphenToUpperCase(property);

        if (name.includes("-reset")) {
            propName = propName.split("Reset")[0];
        }

        if (value.configs.filter((config) => config.type === "boolean").length > 0) {
            it(`should config --${name} correctly`, async () => {
                if (name === "optimization-split-chunks") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`splitChunks: false`);
                } else if (name.includes("reset")) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: []`);
                } else if (name === "optimization-runtime-chunk") {
                    const { exitCode, stderr } = await run(__dirname, [`--${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                } else {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!name.includes("reset")) {
                it(`should config --no-${name} correctly`, async () => {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();

                    if (name === "optimization-split-chunks") {
                        expect(stdout).toContain("splitChunks: false");
                    } else {
                        expect(stdout).toContain(`${propName}: false`);
                    }
                });
            }
        }

        // ignoring optimization-runtime-* and split-chunks-fallback-* flags because WebpackClITestPlugin logs [Object]
        // need improve the plugin to log for multi-level options i.e, optimization.runtime
        if (
            value.configs.filter((config) => config.type === "string").length > 0 &&
            !name.includes("runtime-") &&
            !name.includes("fallback-")
        ) {
            it(`should config --${name} correctly`, async () => {
                if (name === "optimization-split-chunks-chunks") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
                        `--${name}`,
                        "initial",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`chunks: 'initial'`);
                } else if (name === "optimization-mangle-exports") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
                        "--optimization-mangle-exports",
                        "size",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`mangleExports: 'size'`);
                } else if (name === "optimization-used-exports") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
                        "--optimization-used-exports",
                        "global",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`usedExports: 'global'`);
                } else if (name === "optimization-split-chunks-default-size-types") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
                        "--optimization-split-chunks-default-size-types",
                        "global",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`defaultSizeTypes: [Array]`);
                } else if (name === "optimization-side-effects") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
                        "--optimization-side-effects",
                        "flag",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'flag'`);
                } else {
                    const { exitCode, stderr, stdout } = await run(__dirname, [
                        `--${name}`,
                        "named",
                    ]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'named'`);
                }
            });
        }

        if (
            value.configs.filter((config) => config.type === "number").length > 0 &&
            !name.includes("fallback-")
        ) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "10"]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (name === "optimization-split-chunks") {
                    expect(stdout).toContain(`chunks: 'async'`);
                    expect(stdout).toContain(`minChunks: 1`);
                } else {
                    expect(stdout).toContain(`${propName}: 10`);
                }
            });
        }
    }
});
