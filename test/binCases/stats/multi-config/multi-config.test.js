"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("multi-config", () => {
	const { code, stdout, stderr } = run(__dirname);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(stderr).toHaveLength(0);
});
test("multiple-config with --info-verbosity=verbose", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--config",
		"./webpack.config.verbose.js",
		"--info-verbosity",
		"verbose",
		"--mode",
		"production"
	]);
	const summary = extractSummary(stdout);
	expect(code).toBe(0);
	expect(code).not.toBeNull();
	expect(code).toBeDefined();
	expect(stderr).toContain("Compilation  starting...");
	expect(summary).toContain("index.js");
	expect(summary).toContain("index2.js");
	expect(stderr).toBeDefined();
	expect(stderr).not.toBeNull();
});
