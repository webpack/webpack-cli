"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("Hash: ");
	expect(stdout[1]).toContain("Version: ");
	expect(stdout[2]).toContain("Child");
	expect(stdout[6]).toContain("entry-a.bundle.js");
	expect(stdout[9]).toContain("Child");
	expect(stdout[13]).toContain("entry-b.bundle.js");
	expect(stderr).toHaveLength(0);
};
