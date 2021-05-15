"use strict";

const { run, hyphenToUpperCase, getWebpackCliArguments } = require("../../utils/test-utils");
const externalsPresetsFlags = getWebpackCliArguments("externals-presets-");

describe("externals related flag", () => {
    it("should set externals properly", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--externals", "./main.js"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externals: [ './main.js' ]`);
    });

    it("should set externalsType properly", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--externals", "var"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externalsType: 'var'`);
    });

    it("should accept --external-type values", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--externals-type", "var"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externalsType: 'var'`);
    });

    it("should reset externals", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--externals-reset"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`externals: []`);
    });

    for (const [name] of Object.entries(externalsPresetsFlags)) {
        // extract property name from flag name
        const property = name.split("externals-presets-")[1];
        const propName = hyphenToUpperCase(property);

        it(`should config --${name} correctly`, async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [`--${name}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`${propName}: true`);
        });

        it(`should config --no-${name} correctly`, async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [`--no-${name}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`${propName}: false`);
        });
    }
});
