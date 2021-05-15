const path = require("path");

const { run } = require("../../../utils/test-utils");

describe("failure", () => {
    it("should log error on not installed registers", async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "webpack.config.iced"]);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(
            `Unable load '${path.resolve(__dirname, "./webpack.config.iced")}'`,
        );
        expect(stderr).toContain('Unable to use specified module loaders for ".iced".');
        expect(stderr).toContain("Cannot find module 'iced-coffee-script/register'");
        expect(stderr).toContain("Cannot find module 'iced-coffee-script'");
        expect(stderr).toContain("Please install one of them");
        expect(stdout).toBeFalsy();
    });
});
