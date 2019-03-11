"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("custom-preset", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--entry",
		"./index.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--display"
	]);

	const summary = extractSummary(stdout);

	expect(stderr).toHaveLength(0);
	expect(code).toBe(0);
	expect(summary).toHaveLength(0);
});
