"use strict";

const { run } = require("../../../testUtils");

test("help-output", () => {
	const { code, stdout, stderr } = run(__dirname, ["--help"]);
	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toMatch(/webpack/);
	expect(stdout).toContain("Config options:");
	expect(stdout).toContain("Basic options:");
	expect(stdout).toContain("Module options:");
	expect(stdout).toContain("Output options:");
	expect(stdout).toContain("Advanced options:");
	expect(stdout).toContain("Resolving options:");
	expect(stdout).toContain("Optimizing options:");
	expect(stdout).toContain("Stats options:");
	expect(stdout).toContain("Options:");
	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
});
