"use strict";

const { run } = require("../../../testUtils.ts");

test("build-delimiter", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--entry",
		"./index.js",
		"--display",
		"normal",
		"--build-delimiter",
		"success"
	]);

	expect(code).toBe(0);
	expect(stdout).toContain("success");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
