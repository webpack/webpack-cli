"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(2);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[1]).toContain("ERROR Insufficient number of arguments provided");
	expect(stdout[2]).toContain("Alternatively, run `webpack(-cli) --help` for usage info");
	expect(stdout[4]).toContain("Hash: ");
	expect(stdout[5]).toContain("Version: ");
	expect(stdout[6]).toContain("Time: ");
	expect(stdout[7]).toContain("");
	expect(stdout[9]).toContain("WARNING");
	expect(stdout[10]).toContain("The \'mode\' option has not been set");
	expect(stdout[11]).toContain("You can also set it to \'none\'");
	expect(stdout[12]).toContain("");
	expect(stdout[13]).toContain("ERROR in Entry module not found");
	expect(stderr).toHaveLength(0);
};
