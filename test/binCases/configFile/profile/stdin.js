"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[8]).toContain("factory:");
	expect(stdout[10]).toContain("factory:");
	expect(stdout[12]).toContain("factory:");
	expect(stderr).toHaveLength(0);
};
