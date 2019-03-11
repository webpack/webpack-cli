"use strict";

jest.setTimeout(10E6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { run, extractSummary } = require("../../../testUtils");

test("single-config", async done => {
	const { code, stdout, stderr } = await run(__dirname);

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
