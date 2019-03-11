"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("function-promise", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--config",
		"./webpack.config.js",
		"--target",
		"async-node",
		"--mode",
		"production"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("entry.bundle.js");
	expect(stderr).toHaveLength(0);
});
