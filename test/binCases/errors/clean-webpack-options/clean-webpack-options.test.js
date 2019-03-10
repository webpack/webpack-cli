"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("clean-webpack-options", () => {
	const { code, stdout, stderr } = run(__dirname, []);

	const summary = extractSummary(stdout);

	expect(code).toBe(1);

	expect(summary).toHaveLength(0);

	expect(stderr).toContain("Invalid configuration object.");
	expect(stderr).toContain("configuration.context should be a string");
	expect(stderr).toContain("The base directory ");

	expect(stderr.split("\n")).toHaveLength(4);
});
