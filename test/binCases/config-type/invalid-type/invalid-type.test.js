"use strict";

const { run } = require("../../../testUtils");

test("invalid-type", () => {
	const { code, stderr } = run(__dirname, [
		"--config",
		"./webpack.config.js",
		"--target",
		"async-node",
		"--mode",
		"production"
	]);

	expect(code).not.toBe(0);
	expect(stderr).toEqual(expect.anything());
	expect(stderr).toContain(
		"Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema."
	);
});
