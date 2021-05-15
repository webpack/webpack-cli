"use strict";

const { run, hyphenToUpperCase, getWebpackCliArguments } = require("../../utils/test-utils");
const watchFlags = getWebpackCliArguments("watch");

describe("watch config related flag", () => {
    for (const [name, value] of Object.entries(watchFlags)) {
        // extract property name from flag name
        const property = name.split("watch-options-")[1];
        const propName = hyphenToUpperCase(property);

        if (propName === "stdin") {
            return;
        }

        if (value.configs.filter((config) => config.type === "boolean").length > 0 && name !== "watch") {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (name.includes("reset")) {
                    expect(stdout).toContain(`watchOptions: { ignored: [] }`);
                } else {
                    expect(stdout).toContain(`watchOptions: { ${propName}: true }`);
                }
            });

            if (!name.endsWith("-reset")) {
                it(`should config --no-${name} correctly`, async () => {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`watchOptions: { ${propName}: false }`);
                });
            }
        }

        if (value.configs.filter((config) => config.type === "number").length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "10"]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`watchOptions: { ${propName}: 10 }`);
            });
        }

        if (value.configs.filter((config) => config.type === "string").length > 0) {
            it(`should config --${name} correctly`, async () => {
                if (propName === "poll") {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "200"]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`watchOptions: { ${propName}: 200 }`);
                } else {
                    const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "ignore.js"]);

                    expect(exitCode).toBe(0);
                    expect(stderr).toBeFalsy();
                    expect(stdout).toContain(`watchOptions: { ${propName}: [ 'ignore.js' ] }`);
                }
            });
        }
    }
});
