"use strict";

const { run, extractSummary } = require("../../../testUtils");

test.skip("uglifyjsplugin-empty-args", () => {
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
		"--plugin",
		"uglifyjs-webpack-plugin"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);

	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("bytes"); // without uglifyjs it's multiple kBs

	expect(stderr).toHaveLength(0);
});
