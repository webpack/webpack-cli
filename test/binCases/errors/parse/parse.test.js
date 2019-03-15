"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("info-verbosity", () => {
	const { stderr, stdout, code } = run(__dirname, []);

	const summary = extractSummary(stdout);

	expect(code).toBe(2);
	expect(summary).toContain("./index.js");
	expect(summary).toContain("[built]");
	expect(summary).toContain("[failed]");
	expect(summary).toContain("[1 error]");
	expect(summary).toContain("ERROR in ./index.js");
	expect(summary).toContain("Module parse failed:");

	expect(stderr).toHaveLength(0);
});
