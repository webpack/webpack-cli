"use strict";

const { run, hyphenToUpperCase, getWebpackCliArguments } = require("../../utils/test-utils");
const statsFlags = getWebpackCliArguments("stats-");

describe("stats config related flag", () => {
    for (const [name, value] of Object.entries(statsFlags)) {
        // extract property name from flag name
        const property = name.split("stats-")[1];
        const propName = hyphenToUpperCase(property);

        if (value.configs.filter((config) => config.type === "boolean").length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (name.includes("-reset")) {
                    const option = propName.split("Reset")[0];
                    expect(stdout).toContain(`${option}: []`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            if (!name.endsWith("-reset")) {
                it(`should config --no-${name} correctly`, async () => {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: false`);
                });
            }
        }

        if (value.configs.filter((config) => config.type === "number").length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "10"]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (value.configs.filter((config) => config.type === "string").length > 0) {
            const acceptsSingleValue = ["preset", "modulesSort", "logging", "chunksSort", "assetsSort"];

            it(`should config --${name} correctly`, async () => {
                if (name.includes("stats-colors")) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "u001b[32m"]);
                    const option = name.split("stats-colors-")[1];

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`colors: { ${option}: 'u001b[32m' }`);
                } else if (acceptsSingleValue.includes(propName)) {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "log"]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'log'`);
                } else if (name === "stats-context") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "log"]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain("log");
                } else if (name === "stats-entrypoints" || name === "stats-error-details") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "auto"]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: 'auto'`);
                } else {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "log"]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`${propName}: [ 'log' ]`);
                }
            });
        }
    }
});
