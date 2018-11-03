"use strict";

jest.setTimeout(10E5);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { runWatch } = require("../../../testUtils");

test("info-verbosity-off", async(done) => {
	const result = await runWatch(__dirname, [
		"--entry ",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--watch",
		"--info-verbosity",
		"none"
	]);
	const { stdout, stderr } = result;
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("");
	expect(stdout).not.toContain("webpack is watching the files…");

	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
	done();
});
