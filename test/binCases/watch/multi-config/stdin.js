"use strict";

module.exports = function testAssertions(stdout, stderr, done) {
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("");
	expect(stdout[1]).toContain("webpack is watching the files…");

	expect(stderr).toHaveLength(0);
	done();
};
