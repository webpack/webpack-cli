"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("profile", () => {
	const { code, stdout, stderr } = run(__dirname, []);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("factory:");
	expect(stderr).toHaveLength(0);
});
