"use strict";

const { run } = require("../../../testUtils");

// TODO: find a way to hook ts-node before running webpack
// NOTE: as it is now, the test generates an errors
test.skip("webpack-ts-config", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node"
	]);
	expect(code).toBe(0);
	expect(stdout).toContain("./index2.js");
	expect(stderr).toHaveLength(0);
});
