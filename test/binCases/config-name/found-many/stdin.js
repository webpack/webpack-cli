"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[8]).toContain("./index2.js");
	expect(stdout[15]).toContain("./index3.js");
	expect(stderr).toHaveLength(0);
};
