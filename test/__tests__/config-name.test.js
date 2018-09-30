"usr strict";

const run = require("../testUtils");

test("found-many", () => {
	const { code, stdout, stderr } = run("config-name/found-many", [
		"--config", "./webpack.config.js",
		"--config-name", "bar",
		"--output-filename", "[name].js",
		"--output-chunk-filename", "[id].chunk.js",
		"--target", "async-node",
		"--mode", "production",
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[9]).toContain("./index2.js");
	expect(stdout[17]).toContain("./index3.js");
	expect(stderr).toHaveLength(0);
});

test("found-one", () => {
	const { code, stdout, stderr } = run("config-name/found-one", [
		"--config", "./webpack.config.js",
		"--config-name", "bar",
		"--output-filename", "[name].js",
		"--output-chunk-filename", "[id].chunk.js",
		"--target", "async-node",
	]);

	expect(code).toBe(0);
	expect(stdout).toEqual(expect.anything());
	expect(stdout[7]).toContain("./index2.js");
	expect(stderr).toHaveLength(0);
});

test("not-found", () => {
	const { code, stdout, stderr } = run("config-name/not-found", [
		"--config", "./webpack.config.js",
		"--config-name", "foo",
	]);

	expect(code).not.toBe(0);
	expect(stdout).toHaveLength(0);
	expect(stderr[0]).toContain("Configuration with name 'foo' was not found.");
});
