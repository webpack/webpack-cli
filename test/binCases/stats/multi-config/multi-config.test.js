"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("multi-config", () => {
	const { code, stdout, stderr } = run(__dirname);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(stderr).toHaveLength(0);
});
