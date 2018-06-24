"use strict";

module.exports = function testAssertions(stdout, stderr, done) {
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("");
	expect(stdout[1]).not.toContain("webpack is watching the files…");
	expect(stdout[1]).toContain("Version: webpack");

	expect(stderr).toHaveLength(0);
	done();
};
