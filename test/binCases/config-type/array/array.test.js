"usr strict";

const { run } = require("../../../testUtils.ts");

test("array", () => {
	const { code, stdout, stderr } = run(__dirname, [
		"--config",
		"./webpack.config.js",
		"--target",
		"async-node",
		"--mode",
		"production"
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("Child");
	expect(stdout).toContain("entry-a.bundle.js");
	expect(stdout).toContain("Child");
	expect(stdout).toContain("entry-b.bundle.js");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
