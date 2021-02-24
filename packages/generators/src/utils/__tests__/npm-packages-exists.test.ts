import { npmPackagesExists } from '../npm-packages-exists';
import { resolvePackages } from '../resolve-packages';

jest.mock('../resolve-packages');

// TS is not aware that jest changes the type of resolvePackages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockResolvePackages = resolvePackages as any;

describe('npmPackagesExists', () => {
    test('resolves packages when they are available on the local filesystem', () => {
        npmPackagesExists(['./testpkg']);

        expect(mockResolvePackages.mock.calls[mockResolvePackages.mock.calls.length - 1][0]).toEqual(['./testpkg']);
    });

    test("throws a TypeError when an npm package name doesn't include the prefix", () => {
        expect(() => npmPackagesExists(['my-webpack-scaffold'])).toThrowError(TypeError);
    });
});
