"use strict";

jest.setTimeout(10E6);

const { run } = require("../../../testUtils");

test("single-config", () => {
	const { code, stdout, stderr } = run(__dirname);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("main.js");
	expect(stdout).toContain("chunk");
	expect(stdout).not.toContain("./index.js");
	expect(stdout).not.toContain("[built]");
	expect(stdout).toContain("1 module");

	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
