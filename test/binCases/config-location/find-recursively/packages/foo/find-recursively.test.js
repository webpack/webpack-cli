"use strict";

const { run } = require("../../../../../testUtils");

test("find-recursively", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node"
	]);
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("/index2.js");
	expect(stderr).toHaveLength(0);
});
