"use strict";
const exists = require("./npm-exists");

describe("npm-exists", () => {
	it("should successfully existence of a published module", () => {
		exists("webpack-addons-ylvis").then(status => {
			expect(status).toBe(true);
		});
	});

	it("should return false for the existence of a fake module", () => {
		exists("webpack-addons-noop").then(status => {
			expect(status).toBe(false);
		});
	});
});
