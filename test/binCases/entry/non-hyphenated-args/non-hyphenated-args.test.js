"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("non-hyphenated-args", () => {
	const { stdout, code, stderr } = run(__dirname, [
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

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("main.js"); // non-hyphenated arg ./a.js should create chunk "main"
	expect(summary).toContain("a.js"); // a.js should be in chunk 0
	expect(stderr).toHaveLength(0);
});
