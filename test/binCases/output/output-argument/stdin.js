"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[4]).toContain("bundle.js");
	expect(stdout[6]).toMatch(/index\.js.*\{0\}/);
	expect(stderr).toHaveLength(0);
};
