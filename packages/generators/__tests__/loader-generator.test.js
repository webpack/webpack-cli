"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_generator_1 = require("../loader-generator");
describe("makeLoaderName", () => {
    it("should kebab-case loader name and append '-loader'", () => {
        const loaderName = loader_generator_1.makeLoaderName("This is a test");
        expect(loaderName).toEqual("this-is-a-test-loader");
    });
    it("should not modify a properly formatted loader name", () => {
        const loaderName = loader_generator_1.makeLoaderName("properly-named-loader");
        expect(loaderName).toEqual("properly-named-loader");
    });
});
