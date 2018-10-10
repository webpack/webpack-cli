"use strict";

const { runWatch } = require("../../../testUtils");

test("single-config", done => {
	jest.setTimeout(10000);
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
		expect(stdout).toContain("");
		expect(stdout).toEqual(expect.anything());
		expect(stdout).toContain("");
		expect(stdout).toContain("webpack is watching the files…");

		expect(stderr).toHaveLength(0);
		expect(stdout).toMatchSnapshot();
		done();
	});
});
