"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(2);
	expect(stdout[0]).toContain("Hash: ");
	expect(stdout[1]).toContain("Version: ");
	expect(stdout[2]).toContain("Time: ");
	expect(stdout[4]).toContain(
		"ERROR in Entry module not found: Error: Can't resolve"
	);

	expect(stderr).toHaveLength(0);
};
