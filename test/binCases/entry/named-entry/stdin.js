"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[5]).toContain("foo.js"); // named entry from --entry foo=./a.js
	expect(stdout[6]).toContain("null.js");
	expect(stdout[9]).toMatch(/a\.js.*\{0\}/);
	expect(stdout[10]).toMatch(/index\.js.*\{1\}/);
	expect(stderr).toHaveLength(0);
};
