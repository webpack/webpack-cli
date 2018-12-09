"use strict";

jest.setTimeout(10e6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { runWatch, extractSummary } = require("../../../testUtils");

test("info-verbosity-verbose", async done => {
	const result = await runWatch(__dirname, [
		"--entry ",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--watch",
		"--info-verbosity",
		"verbose"
	]);
	const { stdout, stderr } = result;

	const summary = extractSummary(stdout);

	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("Compilation");
	expect(summary).toContain("webpack is watching the files…");

	expect(stderr).toHaveLength(0);
	expect(summary).toMatchSnapshot();
	done();
});
