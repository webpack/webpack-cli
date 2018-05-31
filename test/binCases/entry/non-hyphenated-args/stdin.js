"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[5]).toContain("main.js"); // non-hyphenated arg ./a.js should create chunk "main"
	expect(stdout[6]).toMatch(/a\.js.*\{0\}/); // a.js should be in chunk 0
	expect(stderr).toHaveLength(0);
};
