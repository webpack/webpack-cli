"use strict";

const { runWatch } = require("../../../testUtils");

test("multi-config", done => {
	jest.setTimeout(10000);
	runWatch(__dirname).then(result => {
		const { stdout, stderr } = result;
		expect(stdout).toContain("");
		expect(stdout).toContain("webpack is watching the files…");

		expect(stderr).toHaveLength(0);
		expect(stdout).toMatchSnapshot();
		done();
	});
});
