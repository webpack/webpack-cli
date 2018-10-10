"use strict";

const { run } = require("../../../testUtils");

test("output-argument", () => {
	const { code, stdout } = run(__dirname, [
		"./index.js",
		"-o",
		"./bin/output/output-argument/bundle.js",
		"--target",
		"async-node"
	]);
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("bundle.js");
	expect(stdout).toMatch(/index\.js.*\{0\}/);
	expect(stdout).toMatchSnapshot();
});
