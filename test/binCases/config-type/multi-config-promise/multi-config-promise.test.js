"usr strict";

const { run, extractSummary } = require("../../../testUtils");

test("array", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--config",
		"./a.webpack.config.js",
		"--config",
		"./b.webpack.config.js",
		"--target",
		"async-node",
		"--mode",
		"production"
	]);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toEqual(expect.anything());
	expect(summary).toContain("entry-a.bundle.js");
	expect(summary).toContain("entry-b.bundle.js");
	expect(stderr).toHaveLength(0);
});
