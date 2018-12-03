"use strict";

const { run } = require("../../../testUtils.ts");

test("clean-webpack-options", () => {
	const { code, stdout, stderr } = run(__dirname, []);

	expect(code).toBe(1);

	expect(stdout).toHaveLength(0);

	expect(stderr).toContain("Invalid configuration object.");
	expect(stderr).toContain("configuration.context should be a string");
	expect(stderr).toContain("The base directory ");

	expect(stderr.split("\n")).toHaveLength(4);
	expect(stdout).toMatchSnapshot();
	expect(stderr).toMatchSnapshot();
});
