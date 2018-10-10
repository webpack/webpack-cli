"use strict";

const { run } = require("../../../testUtils");

test("silent", () => {
	const { code, stdout, stderr } = run(__dirname, ["--silent"]);

	expect(code).toBe(0);
	expect(stdout).toHaveLength(0);
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
