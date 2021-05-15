"use strict";

const { run, hyphenToUpperCase, getWebpackCliArguments } = require("../../utils/test-utils");
const experimentsFlags = getWebpackCliArguments("experiments-");

describe("experiments option related flag", () => {
    for (const [name, value] of Object.entries(experimentsFlags)) {
        // extract property name from flag name
        let property;

        if (name.includes("-lazy-compilation-")) {
            property = name.split("experiments-lazy-compilation-")[1];
        } else {
            property = name.split("experiments-")[1];
        }

        const propName = hyphenToUpperCase(property);

        if (propName === "client" || propName === "test") {
            return;
        }

        if (value.configs.filter((config) => config.type === "boolean").length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (name.includes("-lazy-compilation-")) {
                    expect(stdout).toContain(`lazyCompilation: { ${propName}: true }`);
                } else {
                    expect(stdout).toContain(`${propName}: true`);
                }
            });

            it(`should config --no-${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (name.includes("-lazy-compilation-")) {
                    expect(stdout).toContain(`lazyCompilation: { ${propName}: false }`);
                } else {
                    expect(stdout).toContain(`${propName}: false`);
                }
            });
        }
    }
});
