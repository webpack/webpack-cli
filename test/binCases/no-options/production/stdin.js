"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(2);
	expect(stdout).toEqual(expect.anything());
	expect(stderr[1]).toContain("Insufficient number of arguments or no entry found.");
	expect(stderr[2]).toContain("Alternatively, run 'webpack(-cli) --help' for usage info.");
	expect(stderr).toHaveLength(5);
};
