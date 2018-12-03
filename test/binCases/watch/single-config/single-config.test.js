"use strict";

/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

jest.setTimeout(10E6);

const { runWatch } = require("../../../testUtils.ts");

test("single-config", async(done) => {
	const result = await runWatch(__dirname, [
		"--entry",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--watch"
	]);

	const { stdout, stderr } = result;
	expect(stdout).toContain("");
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("");
	expect(stdout).toContain("webpack is watching the files…");

	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
	done();

});
