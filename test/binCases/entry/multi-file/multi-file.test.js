"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("multi-file", () => {
	const { stdout, exitCode, stderr } = run(__dirname, [
		"--entry",
		"./index.js",
		"--entry",
		"./a.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node"
	]);

	const summary = extractSummary(stdout);

	expect(exitCode).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("null.js");
	expect(summary).toContain("index.js");
	expect(summary).toContain("a.js");
	expect(stderr).toHaveLength(0);
});
