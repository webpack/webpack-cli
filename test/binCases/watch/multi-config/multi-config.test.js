"use strict";

const { runWatch } = require("../../../testUtils");
jest.setTimeout(30000);
test("multi-config", done => {
	return runWatch(__dirname).then(result => {
		const { stdout, stderr } = result;
		expect(stdout).toContain("");
		expect(stdout).toContain("webpack is watching the files…");

		expect(stderr).toHaveLength(0);
		expect(stdout).toMatchSnapshot();
		done();
	});
});
