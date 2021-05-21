"use strict";

const { run, hyphenToUpperCase, getWebpackCliArguments } = require("../../utils/test-utils");
const snapshotFlags = getWebpackCliArguments("snapshot");

describe("snapshot config related flags", () => {
    for (const [name, value] of Object.entries(snapshotFlags)) {
        // extract property name from flag name
        const property = name.split("snapshot-")[1];
        const propName = hyphenToUpperCase(property);

        if (value.configs.filter((config) => config.type === "boolean").length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();

                if (name.includes("reset")) {
                    const option = propName.split("Reset")[0];
                    expect(stdout).toContain(`${option}: []`);
                } else if (name.includes("timestamp")) {
                    expect(stdout).toContain(`timestamp: true`);
                } else if (name.includes("hash")) {
                    expect(stdout).toContain(`hash: true`);
                }
            });
        }

        if (value.configs.filter((config) => config.type === "string").length > 0) {
            it(`should config --${name} correctly`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [
                    `--${name}`,
                    "./mock/mock.js",
                ]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain("./mock/mock.js");
            });
        }
    }
});
