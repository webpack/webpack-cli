"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).toBe(0);

	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("pre-loaded pre");
	expect(stdout).toContain("post-loaded post");
	expect(stderr).toHaveLength(0);
};
