"use strict";

const { run, extractSummary } = require("../../../testUtils");

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

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("foo.js"); // named entry from --entry foo=./a.js
	expect(summary).toContain("null.js");
	expect(summary).toMatch(/a\.js.*\{0\}/);
	expect(summary).toMatch(/index\.js.*\{1\}/);
	expect(stderr).toHaveLength(0);
	expect(summary).toMatchSnapshot();
});
