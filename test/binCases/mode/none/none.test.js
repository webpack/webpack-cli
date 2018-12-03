"use strict";

const { run } = require("../../../testUtils.ts");

test("none", () => {
	const { code, stdout, stderr } = run(__dirname, ["./index.js", "--mode", "none"]);
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("main.js");
	expect(stdout).toMatch(/index\.js.*\{0\}/);
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
