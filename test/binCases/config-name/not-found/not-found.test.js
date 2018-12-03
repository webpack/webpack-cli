"use strict";

const { run } = require("../../../testUtils.ts");

test("not-found", () => {
	const { code, stdout, stderr } = run(__dirname, ["--config", "./webpack.config.js", "--config-name", "foo"]);
	expect(code).not.toBe(0);
	expect(stdout).toHaveLength(0);
	expect(stderr).toContain("Configuration with name 'foo' was not found.");
	expect(stdout).toMatchSnapshot();
});
