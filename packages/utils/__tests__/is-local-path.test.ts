"use strict";

import * as path from "path";
import { isLocalPath } from "../path-utils";

describe("is-local-path", () => {
	it("returns true for paths beginning in the current directory", () => {
		const p = path.resolve(".", "test", "dir");
		expect(isLocalPath(p)).toBe(true);
	});

	it("returns true for absolute paths", () => {
		const p = path.join("/", "test", "dir");
		expect(isLocalPath(p)).toBe(true);
	});

	it("returns false for npm packages names", () => {
		expect(isLocalPath("webpack-scaffold-ylvis")).toBe(false);
	});

	it("returns false for scoped npm package names", () => {
		expect(isLocalPath("@webpack/test")).toBe(false);
	});
});
