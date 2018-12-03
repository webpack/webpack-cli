"use strict";

const { run } = require("../../../testUtils.ts");

test("info-verbosity", () => {
	const { stderr } = run(__dirname, [
		"--entry",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--info-verbosity",
		"false"
	]);

	expect(stderr).toContain("Invalid values:");
	expect(stderr).toContain("Argument: info-verbosity, Given: \"false\", Choices: \"none\", \"info\", \"verbose\"");
	// snapshot not needed
});
