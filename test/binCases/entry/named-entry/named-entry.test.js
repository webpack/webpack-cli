"use strict";

const run = require("../../../testUtils");

test("named-entry", () => {
	const { stdout, code, stderr } = run(__dirname, [
		"--entry",
		"foo=./a.js",
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
		"--mode",
		"production"
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("foo.js"); // named entry from --entry foo=./a.js
	expect(stdout).toContain("null.js");
	expect(stdout).toMatch(/a\.js.*\{0\}/);
	expect(stdout).toMatch(/index\.js.*\{1\}/);
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
