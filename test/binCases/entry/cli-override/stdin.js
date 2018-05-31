"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[5]).toContain("cliEntry.js");
	expect(stdout[6]).toContain("index.js");
	expect(stderr).toHaveLength(0);
};
