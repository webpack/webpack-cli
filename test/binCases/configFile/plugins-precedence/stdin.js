"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[6]).toContain("ok.js");
	expect(stderr).toHaveLength(0);
};
