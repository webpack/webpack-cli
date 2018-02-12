"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(code).not.toBe(0);
	expect(stderr).toEqual(expect.anything());
	expect(stderr[0]).toContain("Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema.");
};
