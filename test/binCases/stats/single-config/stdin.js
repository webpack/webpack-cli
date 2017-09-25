"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("Hash: ");
	expect(stdout[1]).toContain("Version: ");
	expect(stdout[2]).toContain("Time: ");
	expect(stdout[4]).toContain("\u001b[1m\u001b[32mnull.js\u001b[39m\u001b[22m");
	expect(stdout[5]).toContain("chunk");
	expect(stdout[6]).not.toContain("./index.js");
	expect(stdout[6]).not.toContain("[built]");
	expect(stdout[6]).toContain("1 module");

	expect(stderr).toHaveLength(0);
};
