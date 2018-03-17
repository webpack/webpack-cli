"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("{ PRODUCTION: true, DEVELOPMENT: false }");
	expect(stderr).toHaveLength(0);
};
