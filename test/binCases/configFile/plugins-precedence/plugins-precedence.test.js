"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("plugins-precedence", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--entry",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--define",
		// eslint-disable-next-line quotes
		'TEST="ok"'
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("ok.js");
	expect(stderr).toHaveLength(0);
});
