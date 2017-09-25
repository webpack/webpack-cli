"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).not.toBe(0);
	expect(stdout).toHaveLength(0);
	expect(stderr[0]).toContain("Configuration with name 'foo' was not found.");
};
