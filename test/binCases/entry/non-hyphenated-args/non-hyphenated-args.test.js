"use strict";

const { run } = require("../../../testUtils.ts");

test("non-hyphenated-args", () => {
	const { stdout, code, stderr } = run(__dirname, [
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
	expect(stdout).toContain("main.js"); // non-hyphenated arg ./a.js should create chunk "main"
	expect(stdout).toMatch(/a\.js.*\{0\}/); // a.js should be in chunk 0
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
