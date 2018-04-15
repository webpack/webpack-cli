"use strict";

const makeLoaderName = require("./loader-generator").makeLoaderName;

describe("makeLoaderName", () => {
	it("should kebab-case loader name and append '-loader'", () => {
		const loaderName = makeLoaderName("This is a test");
		expect(loaderName).toEqual("this-is-a-test-loader");
	});

	it("should not modify a properly formatted loader name", () => {
		const loaderName = makeLoaderName("properly-named-loader");
		expect(loaderName).toEqual("properly-named-loader");
	});
});
