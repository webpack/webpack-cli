"use strict";

const { run } = require("../../../testUtils.ts");

test("none", () => {
	const { code, stdout, stderr } = run(__dirname);

	expect(code).toBe(0);
	expect(stdout).toHaveLength(0);
	expect(stderr).toHaveLength(0);
});
