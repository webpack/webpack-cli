"use strict";

const { run } = require("../../../testUtils.ts");

test("found-one", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--config",
		"./webpack.config.js",
		"--config-name",
		"bar",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node"
	]);
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("./index2.js");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
