"use strict";

const { run } = require("../../../testUtils");

test("production", () => {
	const { code, stdout, stderr } = run(__dirname, ["--mode", "production"]);
	expect(code).toBe(2);
	expect(stdout).toEqual(expect.anything());
	expect(stderr).toContain("Insufficient number of arguments or no entry found.");
	expect(stderr).toContain("Alternatively, run 'webpack(-cli) --help' for usage info.");
});
