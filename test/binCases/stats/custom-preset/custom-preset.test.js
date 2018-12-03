"use strict";

const { run } = require("../../../testUtils.ts");

test("custom-preset", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--entry",
		"./index.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--display"
	]);

	expect(stderr).toHaveLength(0);
	expect(code).toBe(0);
	expect(stdout).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
