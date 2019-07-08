import npmPackagesExists from "../npm-packages-exists";
import { resolvePackages } from "../resolve-packages";

jest.mock("../npm-exists");
jest.mock("../resolve-packages");

// TS is not aware that jest changes the type of resolvePackages
const mockResolvePackages = resolvePackages as jest.Mock<typeof resolvePackages>;

describe("npmPackagesExists", () => {
	test("resolves packages when they are available on the local filesystem", () => {
		npmPackagesExists(["./testpkg"]);
		expect(mockResolvePackages.mock.calls[mockResolvePackages.mock.calls.length - 1][0]).toEqual(["./testpkg"]);
	});

	test("throws a TypeError when an npm package name doesn't include the prefix", () => {
		expect(() => npmPackagesExists(["my-webpack-scaffold"])).toThrowError(TypeError);
	});
});
