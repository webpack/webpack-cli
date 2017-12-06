"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(2);
	expect(stdout[0]).toContain("Hash: ");
	expect(stdout[1]).toContain("Version: ");
	expect(stdout[2]).toContain("Time: ");
	expect(stdout[4]).toContain("./index.js");
	expect(stdout[4]).toContain("[built]");
	expect(stdout[4]).toContain("[failed]");
	expect(stdout[4]).toContain("[1 error]");
	expect(stdout[6]).toContain("ERROR in ./index.js");
	expect(stdout[7]).toContain("Module parse failed:");

	expect(stderr).toHaveLength(0);
};
