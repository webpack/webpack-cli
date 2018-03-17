"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("{ PRODUCTION: false, DEVELOPMENT: true }");
	expect(stderr).toHaveLength(0);
};
