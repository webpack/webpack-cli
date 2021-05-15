"use strict";

const { run } = require("../../utils/test-utils");

describe("--dependencies and related flags", () => {
    it("should allow to set dependencies option", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--dependencies", "lodash"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`dependencies: [ 'lodash' ]`);
    });

    it("should reset dependencies option", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["--dependencies-reset"]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("dependencies: []");
    });
});
