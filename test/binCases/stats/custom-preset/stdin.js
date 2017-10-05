"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(stderr).toHaveLength(0);
	expect(code).toBe(0);
	expect(stdout).toHaveLength(0);
};
