"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("multiple-config", () => {
	const { stdout, code, stderr } = run(__dirname, [
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--mode",
		"production"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(code).toBeDefined();
	expect(code).not.toBeNull();
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("a.js"); // named entry from --entry foo=./a.js
	expect(summary).toContain("index.js");
	expect(stderr).toHaveLength(0);
});
