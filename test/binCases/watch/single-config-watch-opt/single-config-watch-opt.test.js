"use strict";

const { runWatch, extractSummary } = require("../../../testUtils");
test("single-config-watch-opt", () => {
	runWatch(__dirname, [
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
		"--watch"
	]).then(result => {
		const { stdout, stderr } = result;

		const summary = extractSummary(stdout);

		expect(summary).toEqual(expect.anything());
		expect(summary).toContain("");
		expect(summary).toContain("webpack is watching the files…");

		expect(stderr).toHaveLength(0);

		expect(summary).toMatchSnapshot();
		return;
	});
});
