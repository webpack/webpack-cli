"use strict";

module.exports = function testAssertions(stdout, stderr, done) {
	expect(stdout).toEqual(expect.anything());
	expect(stdout[0]).toContain("");
	expect(stdout[1]).toContain("Compilation");
	expect(stdout[2]).toContain("");
	expect(stdout[3]).toContain("");
	expect(stdout[4]).toContain("webpack is watching the files…");
	expect(stdout[6]).toContain("");
	expect(stdout[6]).toContain("");
	expect(stdout[7]).toContain("Compilation");
	expect(stdout[8]).toContain("");

	expect(stderr).toHaveLength(0);
	done();
};
