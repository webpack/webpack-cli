"use strict";

jest.setTimeout(10e6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { run, extractSummary } = require("../../../testUtils");

test("single-config", done => {
	const { code, stdout, stderr } = run(__dirname);

	const summary = extractSummary(stdout);

	expect(code).toBe(0);
	expect(summary).toContain("");
	expect(summary).toContain("main.js");
	expect(summary).toContain("chunk");
	expect(summary).not.toContain("./index.js");
	expect(summary).not.toContain("[built]");
	expect(summary).toContain("1 module");

	expect(stderr).toHaveLength(0);
	done();
});
