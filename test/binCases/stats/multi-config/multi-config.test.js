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
	const expectedString = ["Compilation", "starting", "finished", "[webpack-cli]"];

	expectedString.forEach(str => {
		expect(summary).toContain(str);
	});
	expect(code).toBe(0);
	expect(code).toBeDefined();
	expect(code).not.toBeNull();
	expect(stderr).toHaveLength(0);
});
