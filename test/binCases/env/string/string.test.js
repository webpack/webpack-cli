"use strict";

const { run } = require("../../../testUtils");

test("string", () => {
	const { code, stdout } = run(__dirname, [
		"--env",
		"foo",
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
	expect(stdout).toContain("Environment (--env): \"foo\"");
	expect(stdout).toContain("null.js");
	expect(stdout).toMatchSnapshot();
});
