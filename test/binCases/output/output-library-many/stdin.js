"use strict";

const fs = require("fs");
const path = require("path");

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[7]).toMatch(/index\.js.*\{0\}/);
	expect(stderr).toHaveLength(0);

	const output = fs.readFileSync(path.join(__dirname, "../../../js/bin/output/output-library-many/main.js"), "utf-8");
	expect(output).toContain("window.key1=window.key1||{},window.key1.key2=function");
};
