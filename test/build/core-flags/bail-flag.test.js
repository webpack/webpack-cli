"use strict";

const { run } = require("../../utils/test-utils");

describe("--bail flag", () => {
    it("should set bail to true", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--bail"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("bail: true");
    });

    it("should set bail to false", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--no-bail"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("bail: false");
    });
});
