"use strict";

const { run } = require("../../../testUtils.ts");

test("module-bind", () => {
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
		"--module-bind-pre",
		"pre=./pre-loader",
		"--module-bind-post",
		"post=./post-loader"
	]);
	expect(code).toBe(0);

	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("pre-loaded pre");
	expect(stdout).toContain("post-loaded post");
	expect(stderr).toHaveLength(0);
});
