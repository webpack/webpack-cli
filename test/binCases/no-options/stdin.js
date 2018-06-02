"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(stdout[3]).toContain("Insufficient number of arguments provided");
};
