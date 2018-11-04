"use strict";

const { run } = require("../../../testUtils");

test("profile", () => {
	const { code, stdout, stderr } = run(__dirname, []);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("factory:");
	expect(stderr).toHaveLength(0);
});
