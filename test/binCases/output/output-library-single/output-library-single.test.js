"use strict";

const { run, extractSummary } = require("../../../testUtils");

const { readFileSync } = require("fs");
const { resolve } = require("path");

test("output-library-single", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"./index.js",
		"--target",
		"async-node",
		"--output-library-target",
		"window",
		"--output-library",
		"key1"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("index.js");
	expect(stderr).toHaveLength(0);
	const outputPath = resolve(__dirname, "bin", "main.js");
	const output = readFileSync(outputPath, "utf-8");
	expect(output).toContain("window.key1=function");
});
