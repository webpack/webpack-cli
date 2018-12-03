"use strict";

const { run } = require("../../../testUtils.ts");

test("info-verbosity", () => {
	const { stderr, stdout, code } = run(__dirname, ["a", "bundle.js", "--mode", "production"]);

	expect(code).toBe(2);
	expect(stdout).toContain("bundle.js");

	expect(stderr).toHaveLength(0);
});
