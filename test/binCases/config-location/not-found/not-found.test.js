"use strict";

const { run } = require("../../../testUtils");

test("not-found", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--mode",
		"production"
	]);
	expect(code).toBe(0);
	expect(stdout).toContain("./src/index.js");
	expect(stderr).toHaveLength(0);
});
