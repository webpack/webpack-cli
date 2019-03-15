"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("not-found", () => {
	const { code, stdout, stderr } = run(__dirname, ["--config", "./webpack.config.js", "--config-name", "foo"]);

	const summary = extractSummary(stdout);

	expect(code).not.toBe(0);
	expect(summary).toHaveLength(0);
	expect(stderr).toContain("Configuration with name 'foo' was not found.");
});
