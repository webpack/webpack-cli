"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(stderr[stderr.length - 3]).toContain("Invalid values:");
	expect(stderr[stderr.length - 2]).toContain("  Argument: info-verbosity, Given: \"false\", Choices: \"none\", \"info\", \"verbose\"");
};
