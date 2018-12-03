"use strict";

const { run } = require("../../../testUtils.ts");

test("plugins-precedence", () => {
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
		"--define",
		"TEST=\"ok\""
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("ok.js");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
