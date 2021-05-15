"use strict";

const { run } = require("../../utils/test-utils");

describe("infrastructure logging related flag", () => {
    it("should set infrastructureLogging.debug properly", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--infrastructure-logging-debug",
            "myPlugin",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`debug: [ 'myPlugin' ]`);
    });

    it("should reset infrastructureLogging.debug to []", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--infrastructure-logging-debug-reset",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`debug: []`);
    });

    it("should set infrastructureLogging.level properly", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            "--infrastructure-logging-level",
            "log",
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compiler 'compiler' starting...");
        expect(stderr).toContain("Compiler 'compiler' finished");
        expect(stdout).toContain(`level: 'log'`);
    });
});
