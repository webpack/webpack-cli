"use strict";

const { run } = require("../../../testUtils");

test("uglifyjsplugin-empty-args", () => {
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

	expect(code).toBe(0);

	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("bytes"); // without uglifyjs it's multiple kBs

	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
