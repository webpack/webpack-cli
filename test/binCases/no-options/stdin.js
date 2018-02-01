"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(stdout[1]).toContain("Insufficient number of arguments provided");
};
