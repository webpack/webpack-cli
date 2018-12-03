"use strict";

jest.setTimeout(10E6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { runWatch } = require("../../../testUtils.ts");

test("multi-config", async(done) => {
	const result = await runWatch(__dirname);
	const { stdout, stderr } = result;
	expect(stdout).toContain("");
	expect(stdout).toContain("webpack is watching the files…");

	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
	done();
});
