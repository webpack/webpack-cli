"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[5]).toContain("null.js");
	expect(stdout[7]).toContain("foo.js"); // named entry from --entry foo=./a.js
	expect(stdout[9]).toMatch(/index\.js.*\{0\}/);
	expect(stdout[10]).toMatch(/a\.js.*\{1\}/);
	expect(stderr).toHaveLength(0);
};
