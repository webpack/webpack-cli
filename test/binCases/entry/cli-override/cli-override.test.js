"use strict";

const run = require("../../../testUtils");

test("cli-override", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--entry",
		"cliEntry=./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js"
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("cliEntry.js");
	expect(stdout).toContain("index.js");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
