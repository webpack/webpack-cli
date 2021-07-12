"use strict";

const fs = require("fs");
const { runWatch } = require("../../utils/test-utils");

describe("config-watch", () => {
    it("should compile a different entry", async () => {
        const { stderr, stdout } = await runWatch(__dirname, []);
        expect(stdout).toContain("first.js");
        expect(stderr).toBeFalsy();
        fs.writeFile(
            "./webpack.config.js",
            "module.exports = { entry: './src/second.js' }",
            "utf8",
        );
        const { stdout_two } = await runWatch(__dirname, []);
        expect(stdout_two).toContain("second.js");
    });
});
