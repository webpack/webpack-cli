"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(2);
	expect(stdout[0]).toContain("Hash: ");
	expect(stdout[1]).toContain("Version: ");
	expect(stdout[2]).toContain("Time: ");
	expect(stdout[6]).toContain("bundle.js");

	expect(stderr).toHaveLength(0);
};
