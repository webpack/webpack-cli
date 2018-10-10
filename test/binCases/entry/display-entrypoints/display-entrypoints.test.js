"use strict";

const { run } = require("../../../testUtils");

test("display-entrypoints", () => {
	const { stdout, stderr } = run(__dirname, ["--display-entrypoints", "false"]);

	expect(stdout).not.toContain("Entrypoint");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
