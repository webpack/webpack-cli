"use strict";

const { run } = require("../../../testUtils");

test("none", () => {
	const { code, stdout, stderr } = run(__dirname);
	expect(code).toBe(2);
	expect(stdout).toEqual(expect.anything());
	expect(stderr).toContain("Insufficient number of arguments or no entry found.");
	expect(stderr).toContain("Alternatively, run 'webpack(-cli) --help' for usage info.");
});
