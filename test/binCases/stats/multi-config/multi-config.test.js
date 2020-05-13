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
		"webpack.config.verbose.js",
		"--info-verbosity",
		"verbose"
	]);
	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(code).toBeDefined();
	expect(summary).toContain("[webpack-cli]");
	expect(summary).toContain("Compilation starting...");
	expect(summary).toContain("Compilation finished");
	expect(code).not.toBeNull();
	expect(stderr).toHaveLength(0);
});
