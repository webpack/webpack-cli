"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("output-argument", () => {
	const { code, stdout } = run(__dirname, [
		"./index.js",
		"-o",
		"./bin/output/output-argument/bundle.js",
		"--target",
		"async-node"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("bundle.js");
	expect(summary).toContain("index.js");
});
