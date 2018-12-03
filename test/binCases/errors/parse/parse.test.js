"use strict";

const { run } = require("../../../testUtils.ts");

test("info-verbosity", () => {
	const { stderr, stdout, code } = run(__dirname, []);

	expect(code).toBe(2);
	expect(stdout).toContain("./index.js");
	expect(stdout).toContain("[built]");
	expect(stdout).toContain("[failed]");
	expect(stdout).toContain("[1 error]");
	expect(stdout).toContain("ERROR in ./index.js");
	expect(stdout).toContain("Module parse failed:");

	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
