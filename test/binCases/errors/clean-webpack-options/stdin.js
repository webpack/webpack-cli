"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(1);

	expect(stdout).toHaveLength(0);

	expect(stderr[0]).toContain("Invalid configuration object.");
	expect(stderr[1]).toContain("configuration.context should be a string");
	expect(stderr[2]).toContain("The base directory ");

	expect(stderr).toHaveLength(4);
};
