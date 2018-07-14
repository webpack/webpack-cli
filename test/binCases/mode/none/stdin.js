"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[5]).toContain("main.js");
	expect(stdout[7]).toMatch(/index\.js.*\{0\}/);
	expect(stderr).toHaveLength(0);
};
