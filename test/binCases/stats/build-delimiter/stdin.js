"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	const lastLines = stdout.slice(-2);
	expect(code).toBe(0);
	expect(lastLines[0]).toBe("success");
	expect(lastLines[1]).toBe("");
	expect(stderr).toHaveLength(0);
};
