"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("cli-override", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--entry",
		"cliEntry=./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("cliEntry.js");
	expect(summary).toContain("index.js");
	expect(stderr).toHaveLength(0);
});
