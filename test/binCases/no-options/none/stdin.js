"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(2);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("Hash: ");
	expect(stdout[1]).toContain("Version: ");
	expect(stdout[2]).toContain("Time: ");
	expect(stdout[4]).toContain("");
	expect(stdout[5]).toContain("WARNING");
	expect(stdout[6]).toContain("The \'mode\' option has not been set");
	expect(stdout[7]).toContain("You can also set it to \'none\'");
	expect(stdout[8]).toContain("");
	expect(stdout[9]).toContain("ERROR in Entry module not found");
	expect(stderr).toHaveLength(0);
};
