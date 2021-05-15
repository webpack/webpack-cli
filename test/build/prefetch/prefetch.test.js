"use strict";

const { join } = require("path");
const { run, readFile } = require("../../utils/test-utils");
// eslint-disable-next-line node/no-unpublished-require
const rimraf = require("rimraf");

describe("prefetch", () => {
    afterEach(() => {
        rimraf.sync(join(__dirname, "dist"));
    });

    it("should load the prefetched file", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--prefetch", "./src/p.js", "--mode", "development"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        const content = await readFile(join(__dirname, "/dist/main.js"), "utf-8");

        expect(content).not.toContain("// no prefetching");
    });

    it("should log error when the prefetched file is absent", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--prefetch", "./src/somefile.js"]);

        expect(exitCode).toBe(1);
        expect(stderr).toBeFalsy();
        // Should contain the error message
        expect(stdout).toContain(`Error: Can't resolve './src/somefile.js'`);
    });

    it("should log error when flag value is not supplied", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--prefetch"]);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Error: Option '--prefetch <value>' argument missing`);
        expect(stdout).toBeFalsy();
    });
});
