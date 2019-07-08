"use strict";
import exists from "../npm-exists";

describe("npm-exists", () => {
	it("should successfully existence of a published module", () => {
		exists("webpack-scaffold-demo").then(status => {
			expect(status).toBe(true);
		});
	});

	it("should return false for the existence of a fake module", () => {
		exists("webpack-scaffold-noop").then(status => {
			expect(status).toBe(false);
		});
	});
});
