"use strict";

jest.setTimeout(10E6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { run } = require("../../../testUtils.ts");

test("single-config", async(done) => {
	const { code, stdout, stderr } = await run(__dirname);

	expect(code).toBe(0);
	expect(stdout).toContain("");
	expect(stdout).toContain("main.js");
	expect(stdout).toContain("chunk");
	expect(stdout).not.toContain("./index.js");
	expect(stdout).not.toContain("[built]");
	expect(stdout).toContain("1 module");

	expect(stderr).toHaveLength(0);
	expect(stdout).toMatchSnapshot();
	done();
});
