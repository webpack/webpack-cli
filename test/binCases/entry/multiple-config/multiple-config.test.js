"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("multiple-config", () => {
	const { stdout, exitCode, stderr } = run(__dirname, [
		"--config",
		"./webpack.config.js",
		"--output-file-name",
		"[name].js",
		"--mode",
		"production"
	]);

	const summary = extractSummary(stdout);

	expect(exitCode).toEqual(0);
	expect(exitCode).toBeDefined();
	expect(exitCode).not.toBeNull();
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("a.js"); // named entry from --entry foo=./a.js
	expect(summary).toContain("index.js");
	expect(stderr).toHaveLength(0);
});
