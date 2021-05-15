"use strict";

const { run, hyphenToUpperCase, getWebpackCliArguments } = require("../../utils/test-utils");
const performanceFlags = getWebpackCliArguments("performance-");

describe("module config related flag", () => {
    it(`should config --performance option correctly`, async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [`--no-performance`]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("performance: false");
    });

    for (const [name, value] of Object.entries(performanceFlags)) {
        // extract property name from flag name
        const property = name.split("performance-")[1];
        const propName = hyphenToUpperCase(property);

        if (value.configs.filter((config) => config.type === "number").length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "10"]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (value.configs.filter((config) => config.type === "string").length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`, "warning"]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(`${propName}: 'warning'`);
            });
        }
    }
});
