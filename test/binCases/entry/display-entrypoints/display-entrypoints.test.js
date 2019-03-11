"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("display-entrypoints", () => {
	const { stdout, stderr } = run(__dirname, ["--display-entrypoints", "false"]);

	const summary = extractSummary(stdout);

	expect(summary).not.toContain("Entrypoint");
	expect(stderr).toHaveLength(0);
});
