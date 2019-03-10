"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("string", () => {
	const { code, stdout } = run(__dirname, [
		"--env",
		"foo",
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
	expect(summary).toContain("Environment (--env)");
	expect(summary).toContain("null.js");
});
