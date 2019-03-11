"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("build-delimiter", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--entry",
		"./index.js",
		"--display",
		"normal",
		"--build-delimiter",
		"success"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toContain("success");
	expect(stderr).toHaveLength(0);
});
