"use strict";

const run = require("../../../testUtils");

test("multi-file", () => {
	const { stdout, code, stderr } = run(__dirname, [
		"--entry",
		"./index.js",
		"--entry",
		"./a.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node"
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("null.js");
	expect(stdout).toMatch(/multi.*index\.js.*a\.js/); // should have multi-file entry
	expect(stdout).toMatch(/index\.js.*\{0\}/);
	expect(stdout).toMatch(/a\.js.*\{0\}/);
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
