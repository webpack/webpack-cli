"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[4]).toContain("null.js");
	expect(stdout[6]).toContain("foo.js"); // named entry from --entry foo=./a.js
	expect(stdout[8]).toMatch(/index\.js.*\{0\}/);
	expect(stdout[9]).toMatch(/a\.js.*\{1\}/);
	expect(stderr).toHaveLength(0);
};
