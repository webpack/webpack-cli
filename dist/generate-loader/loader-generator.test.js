"use strict";

var makeLoaderName = require("./loader-generator").makeLoaderName;

describe("makeLoaderName", () => {
	it("should kebab-case loader name and append '-loader'", () => {
		var loaderName = makeLoaderName("This is a test");
		expect(loaderName).toEqual("this-is-a-test-loader");
	});

	it("should not modify a properly formatted loader name", () => {
		var loaderName = makeLoaderName("properly-named-loader");
		expect(loaderName).toEqual("properly-named-loader");
	});
});
