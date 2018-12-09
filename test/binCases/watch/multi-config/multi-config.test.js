"use strict";

jest.setTimeout(10e6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { runWatch, extractSummary } = require("../../../testUtils");

test("multi-config", async done => {
	const result = await runWatch(__dirname);
	const { stdout, stderr } = result;

	const summary = extractSummary(stdout);

	expect(summary).toContain("");
	expect(summary).toContain("webpack is watching the files…");

	expect(stderr).toHaveLength(0);
	expect(summary).toMatchSnapshot();
	done();
});
