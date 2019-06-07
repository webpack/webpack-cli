"use strict";

const { run } = require("../../../testUtils");

test("webpack-babel-config", () => {
	const { stdout, stderr } = run(__dirname, ["--target", "async-node", "-r", "esm", "@babel/register"]);
	expect(stdout).toContain("es6.js");
	expect(stderr).toHaveLength(0);
});
