"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());

	expect(stdout[7]).toContain("factory:");
	expect(stdout[9]).toContain("factory:");
	expect(stdout[11]).toContain("factory:");
	expect(stderr).toHaveLength(0);
};
