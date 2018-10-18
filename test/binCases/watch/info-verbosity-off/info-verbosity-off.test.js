"use strict";

const { runWatch } = require("../../../testUtils");
jest.setTimeout(30000);
test("info-verbosity-off", () => {
	return runWatch(__dirname, [
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
		"none"
	]).then(result => {
		const { stdout, stderr } = result;
		expect(stdout).toEqual(expect.anything());
		expect(stdout).toContain("");
		expect(stdout).not.toContain("webpack is watching the files…");

		expect(stderr).toHaveLength(0);
		expect(stdout).toMatchSnapshot();
		return;
	});
});
