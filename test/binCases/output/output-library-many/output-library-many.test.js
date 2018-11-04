"use strict";

const { run } = require("../../../testUtils");

const { readFileSync } = require("fs");
const { resolve } = require("path");

test("output-library-many", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"./index.js",
		"--target",
		"async-node",
		"--output-library-target",
		"window",
		"--output-library",
		"key1",
		"--output-library",
		"key2"
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toMatch(/index\.js.*\{0\}/);
	expect(stderr).toHaveLength(0);
	const outputPath = resolve(__dirname, "bin/main.js");
	const output = readFileSync(outputPath, "utf-8");
	expect(output).toContain("window.key1=window.key1||{},window.key1.key2=function");
	expect(stdout).toMatchSnapshot();
});
