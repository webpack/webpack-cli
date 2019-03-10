"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("silent", () => {
	const { code, stdout, stderr } = run(__dirname, ["--silent"]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toHaveLength(0);
	expect(stderr).toHaveLength(0);
});
