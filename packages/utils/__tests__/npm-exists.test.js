"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const npm_exists_1 = require("../npm-exists");
describe("npm-exists", () => {
    it("should successfully existence of a published module", () => {
        npm_exists_1.default("webpack-scaffold-demo").then((status) => {
            expect(status).toBe(true);
        });
    });
    it("should return false for the existence of a fake module", () => {
        npm_exists_1.default("webpack-scaffold-noop").then((status) => {
            expect(status).toBe(false);
        });
    });
});
