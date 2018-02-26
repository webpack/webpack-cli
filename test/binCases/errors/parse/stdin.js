"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(2);
	expect(stdout[0]).toContain("Hash: ");
	expect(stdout[1]).toContain("Version: ");
	expect(stdout[2]).toContain("Time: ");
	expect(stdout[6]).toContain("./index.js");
	expect(stdout[6]).toContain("[built]");
	expect(stdout[6]).toContain("[failed]");
	expect(stdout[6]).toContain("[1 error]");
	expect(stdout[8]).toContain("ERROR in ./index.js");
	expect(stdout[9]).toContain("Module parse failed:");

	expect(stderr).toHaveLength(0);
};
