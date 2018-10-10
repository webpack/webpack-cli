"use strict";

const { runWatch } = require("../../../testUtils");
jest.setTimeout(10000);

test("multi-config", done => {
	runWatch(__dirname).then(result => {
		const { stdout, stderr } = result;
		expect(stdout).toContain("");
		expect(stdout).toContain("webpack is watching the files…");

		expect(stderr).toHaveLength(0);
		expect(stdout).toMatchSnapshot();
		done();
	});
});
