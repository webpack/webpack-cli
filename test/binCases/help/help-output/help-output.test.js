"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("help-output", () => {
	const { code, stdout, stderr } = run(__dirname, ["--help"]);

	expect(code).toBe(0);

	const summary = extractSummary(stdout);

	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("webpack");
	expect(summary).toContain("Config options:");
	expect(summary).toContain("Basic options:");
	expect(summary).toContain("Module options:");
	expect(summary).toContain("Output options:");
	expect(summary).toContain("Advanced options:");
	expect(summary).toContain("Resolving options:");
	expect(summary).toContain("Optimizing options:");
	expect(summary).toContain("Stats options:");
	expect(summary).toContain("Options:");
	expect(stderr).toHaveLength(0);
});
