"use strict";

const { run, extractSummary } = require("../../../testUtils");

test("none", () => {
	const { code, stdout, stderr } = run(__dirname, ["./index.js", "--mode", "none"]);

	expect(code).toBe(0);

	const summary = extractSummary(stdout);

	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("main.js");
	expect(summary).toContain("index.js");
	expect(stderr).toHaveLength(0);
});
