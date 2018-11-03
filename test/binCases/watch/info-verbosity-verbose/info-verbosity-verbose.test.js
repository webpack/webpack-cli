"use strict";

jest.setTimeout(10E6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { runWatch } = require("../../../testUtils");

test("info-verbosity-verbose", async(done) => {
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
		"verbose"
	]);
	const { stdout, stderr } = result;
	expect(stdout).toEqual(expect.anything());
	expect(stdout).toContain("Compilation");
	expect(stdout).toContain("webpack is watching the files…");

	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
	done();
});
