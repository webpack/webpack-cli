"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(stderr[3]).toContain("Error: Invalid configuration object.");
	expect(stderr[4]).toContain("configuration['info-verbosity'] should be one of these:");
	expect(stderr[5]).toContain("\"none\" | \"info\" | \"verbose\"");
};
