"use strict";

const { run } = require("../../../testUtils");

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
	// eslint-disable-next-line quotes
	expect(stderr).toContain('Argument: info-verbosity, Given: "false", Choices: "none", "info", "verbose"');
	// snapshot not needed
});
