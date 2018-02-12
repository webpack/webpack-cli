const fs = require("fs");
const npmPackagesExists = require("./npm-packages-exists");

jest.mock("fs");
jest.mock("./npm-exists");
jest.mock("./resolve-packages");

const mockResolvePackages = require("./resolve-packages").resolvePackages;

describe("npmPackagesExists", () => {
	test("resolves packages when they are available on the local filesystem", () => {
		fs.existsSync.mockReturnValueOnce(true);
		npmPackagesExists(["./testpkg"]);
		expect(mockResolvePackages.mock.calls[mockResolvePackages.mock.calls.length - 1][0]).toEqual(["./testpkg"]);
	});

	test("throws a TypeError when an npm package name doesn't include the prefix", () => {
		fs.existsSync.mockReturnValueOnce(false);
		expect(() => npmPackagesExists(["my-webpack-addon"])).toThrowError(TypeError);
	});

	test("resolves packages when they are available on npm", done => {
		fs.existsSync.mockReturnValueOnce(false);
		require("./npm-exists").mockImplementation(() => Promise.resolve(true));
		npmPackagesExists(["webpack-addons-foobar"]);
		setTimeout(() => {
			expect(mockResolvePackages.mock.calls[mockResolvePackages.mock.calls.length - 1][0]).toEqual(["webpack-addons-foobar"]);
			done();
		}, 10);
	});
});
