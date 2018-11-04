"use strict";

const { run } = require("../../../testUtils");

test("multi-config", () => {
	const { code, stdout, stderr } = run(__dirname);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
