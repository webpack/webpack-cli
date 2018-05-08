"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(2);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[1]).toContain("ERROR Insufficient number of arguments provided");
	expect(stdout[2]).toContain("Alternatively, run `webpack(-cli) --help` for usage info");
	expect(stdout[4]).toContain("Hash: ");
	expect(stdout[5]).toContain("Version: ");
	expect(stdout[6]).toContain("Time: ");
	expect(stdout[7]).toContain("Built at");
	expect(stdout[9]).toContain("ERROR in Entry module not found");
	expect(stdout[10]).toContain("");
	expect(stderr).toHaveLength(0);
};
