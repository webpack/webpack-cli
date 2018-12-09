"use strict";

/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

jest.setTimeout(10e6);

const { runWatch, extractSummary } = require("../../../testUtils");

test("multi-config-watch-opt", async done => {
	const result = await runWatch(__dirname, [
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
	]);

	const { stdout, stderr } = result;

	const summary = extractSummary(stdout);

	expect(summary).toContain("");
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("");
	expect(summary).toContain("webpack is watching the files…");

	expect(stderr).toHaveLength(0);
	expect(summary).toMatchSnapshot();
	done();
});
