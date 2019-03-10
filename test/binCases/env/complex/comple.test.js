"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("complex", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--env.prod=foo",
		"--env.prod=bar",
		"--env=baz",
		"--entry",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("Environment (--env):");
	expect(summary).toContain("baz");
	expect(summary).toContain("null.js");
	expect(summary).toContain("./index.js");
	expect(summary).toContain("[built]");
	expect(stderr).toHaveLength(0);
});
