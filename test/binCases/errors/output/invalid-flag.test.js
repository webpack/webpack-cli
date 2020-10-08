"use strict";

const { run } = require("../../../testUtils");

test("flag error doesn't log unnecessary stuff", () => {
	const { stdout, stderr, code } = run(__dirname, ["--mode", "bokuto"]);
	expect(stdout).toBeFalsy();
	// Should contain flag validation output
	expect(stderr).toContain("Invalid values:\n  Argument: mode");
	// Should not print help output
	expect(stderr).not.toContain("Usage: webpack-cli");
	expect(code).toBe(1);
});

test("schema error doesn't log unnecessary stuff", () => {
	const { stdout, stderr, code } = run(__dirname, ["--config", "./webpack.test.config.js"]);
	expect(stdout).toBeFalsy();
	// Should contain flag validation output
	expect(stderr).toContain(
		"Invalid configuration object"
	);
	// Should not print help output
	expect(stderr).not.toContain("Usage: webpack-cli");
	expect(code).toBe(1);
});
