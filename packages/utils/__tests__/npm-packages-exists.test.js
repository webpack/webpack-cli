"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const npm_packages_exists_1 = require("../npm-packages-exists");
const resolve_packages_1 = require("../resolve-packages");
jest.mock("../npm-exists");
jest.mock("../resolve-packages");
// TS is not aware that jest changes the type of resolvePackages
const mockResolvePackages = resolve_packages_1.resolvePackages;
describe("npmPackagesExists", () => {
    test("resolves packages when they are available on the local filesystem", () => {
        npm_packages_exists_1.default(["./testpkg"]);
        expect(mockResolvePackages.mock.calls[mockResolvePackages.mock.calls.length - 1][0]).toEqual(["./testpkg"]);
    });
    test("throws a TypeError when an npm package name doesn't include the prefix", () => {
        expect(() => npm_packages_exists_1.default(["my-webpack-scaffold"])).toThrowError(TypeError);
    });
});
