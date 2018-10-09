"use strict";

const run = require("../../../testUtils");

test("promise", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--config",
		"./webpack.config.js",
		"--target",
		"async-node",
		"--mode",
		"production"
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("entry.bundle.js");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
