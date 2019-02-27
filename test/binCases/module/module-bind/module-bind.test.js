"use strict";

const { run, extractSummary } = require("../../../testUtils");

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

	const summary = extractSummary(stdout);

	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("pre-loaded pre");
	expect(summary).toContain("post-loaded post");
	expect(stderr).toHaveLength(0);
});
