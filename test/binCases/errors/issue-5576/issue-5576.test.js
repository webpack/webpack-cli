"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("info-verbosity", () => {
	const { stderr, stdout, code } = run(__dirname, ["a", "bundle.js", "--mode", "production"]);

	const summary = extractSummary(stdout);

	expect(code).toBe(2);
	expect(summary).toContain("bundle.js");

	expect(stderr).toHaveLength(0);
});
