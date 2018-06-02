"use strict";

module.exports = function testAssertions(code, stdout, stderr) {
	expect(stdout.join(' ')).not.toContain("Entrypoint");
	expect(stderr).toHaveLength(0);
};
