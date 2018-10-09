"use strict";

const run = require("../../../testUtils");

test("complex", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--env.prod=foo",
		"--env.prod=bar",
		"--env=baz",
		"--entry",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node"
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("Environment (--env):");
	expect(stdout).toContain("baz");
	expect(stdout).toContain("null.js");
	expect(stdout).toContain("./index.js");
	expect(stdout).toContain("[built]");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
