"use strict";

const { run } = require("../../utils/test-utils");

describe("--no-amd flag", () => {
    it("should accept --no-amd", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--no-amd"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("amd: false");
    });
});
