"use strict";

const { readFileSync } = require("fs");
const { resolve } = require("path");

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[7]).toMatch(/index\.js.*\{0\}/);
	expect(stderr).toHaveLength(0);
	const outputPath = resolve("test", "js", "bin", "output", "output-library-many", "main.js");
	const output = readFileSync(outputPath, "utf-8");
	expect(output).toContain("window.key1=window.key1||{},window.key1.key2=function");
};
