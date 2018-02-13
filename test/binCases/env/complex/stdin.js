"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("Hash: ");
	expect(stdout[1]).toContain("Version: ");
	expect(stdout[2]).toContain("Time: ");
	expect(stdout[4]).toContain("Environment (--env): {");
	expect(stdout[5]).toContain("\"prod\": [");
	expect(stdout[8]).toContain("],");
	expect(stdout[9]).toContain("\"baz\": true");
	expect(stdout[10]).toContain("}");
	expect(stdout[12]).toContain("null.js");
	expect(stdout[14]).toContain("./index.js");
	expect(stdout[14]).toContain("[built]");
	expect(stderr).toHaveLength(0);
};
