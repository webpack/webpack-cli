"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[3]).toContain("Insufficient number of arguments provided");
	expect(stdout[4]).toContain("Alternatively, run `webpack(-cli) --help` for usage info");
	expect(stderr).toHaveLength(0);
};
