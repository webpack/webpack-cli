"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const is_local_path_1 = require("../is-local-path");
describe("is-local-path", () => {
    it("returns true for paths beginning in the current directory", () => {
        const p = path.resolve(".", "test", "dir");
        expect(is_local_path_1.default(p)).toBe(true);
    });
    it("returns true for absolute paths", () => {
        const p = path.join("/", "test", "dir");
        expect(is_local_path_1.default(p)).toBe(true);
    });
    it("returns false for npm packages names", () => {
        expect(is_local_path_1.default("webpack-scaffold-ylvis")).toBe(false);
    });
    it("returns false for scoped npm package names", () => {
        expect(is_local_path_1.default("@webpack/test")).toBe(false);
    });
});
