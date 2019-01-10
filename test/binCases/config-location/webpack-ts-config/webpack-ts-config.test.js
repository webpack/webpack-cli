"use strict";

const { run } = require("../../../testUtils");

test("webpack-ts-config", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
	]);
	expect(code).toBe(0);
	expect(stdout).toContain("./index2.js");
	expect(stderr).toHaveLength(0);
});
