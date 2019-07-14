"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("help-output", () => {
	const { code, stdout, stderr } = run(__dirname, ["--help"]);

	expect(code).toBe(0);

	const summary = extractSummary(stdout);

	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("webpack");
	expect(summary).toContain("Usage:");
	expect(summary).toContain("Example:");
	expect(summary).toContain("Available Commands");
	expect(summary).toContain("Options");
});
