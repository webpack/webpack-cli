"use strict";

const { run } = require("../../../testUtils");

test("set-explicitly", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--config",
		"./webpack.dev.js",
		"--config-name",
		"foo",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node"
	]);
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("./index.js");
	expect(stderr).toHaveLength(0);
});
