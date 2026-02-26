const fs = require("node:fs");
const path = require("node:path");
const CLI = require("../../packages/webpack-cli/lib/webpack-cli").default;

const syncMock = jest.fn(() => ({
  stdout: "1.0.0",
}));
jest.setMock("cross-spawn", {
  sync: syncMock,
});

describe("getPackageManager", () => {
  let cli;

  const testYarnLockPath = path.resolve(__dirname, "test-yarn-lock");
  const testNpmLockPath = path.resolve(__dirname, "test-npm-lock");
  const testPnpmLockPath = path.resolve(__dirname, "test-pnpm-lock");
  const testNpmAndPnpmPath = path.resolve(__dirname, "test-npm-and-pnpm");
  const testNpmAndYarnPath = path.resolve(__dirname, "test-npm-and-yarn");
  const testYarnAndPnpmPath = path.resolve(__dirname, "test-yarn-and-pnpm");
  const testAllPath = path.resolve(__dirname, "test-all-lock");
  const noLockPath = path.resolve(__dirname, "no-lock-files");

  const cwdSpy = jest.spyOn(process, "cwd");

  beforeAll(() => {
    // package-lock.json is ignored by .gitignore, so we simply
    // write a lockfile here for testing
    if (!fs.existsSync(testNpmLockPath)) {
      fs.mkdirSync(testNpmLockPath);
    }

    fs.writeFileSync(path.resolve(testNpmLockPath, "package-lock.json"), "");
    fs.writeFileSync(path.resolve(testNpmAndPnpmPath, "package-lock.json"), "");
    fs.writeFileSync(path.resolve(testNpmAndYarnPath, "package-lock.json"), "");
    fs.writeFileSync(path.resolve(testAllPath, "package-lock.json"), "");
  });

  beforeEach(() => {
    cli = new CLI();

    syncMock.mockClear();
  });

  it("should find yarn.lock", async () => {
    cwdSpy.mockReturnValue(testYarnLockPath);

    expect(await cli.getDefaultPackageManager()).toBe("yarn");
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should find package-lock.json", async () => {
    cwdSpy.mockReturnValue(testNpmLockPath);

    expect(await cli.getDefaultPackageManager()).toBe("npm");
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should find pnpm-lock.yaml", async () => {
    cwdSpy.mockReturnValue(testPnpmLockPath);

    expect(await cli.getDefaultPackageManager()).toBe("pnpm");
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should prioritize npm over pnpm", async () => {
    cwdSpy.mockReturnValue(testNpmAndPnpmPath);

    expect(await cli.getDefaultPackageManager()).toBe("npm");
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should prioritize npm over yarn", async () => {
    cwdSpy.mockReturnValue(testNpmAndYarnPath);

    expect(await cli.getDefaultPackageManager()).toBe("npm");
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should prioritize yarn over pnpm", async () => {
    cwdSpy.mockReturnValue(testYarnAndPnpmPath);

    expect(await cli.getDefaultPackageManager()).toBe("yarn");
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should prioritize npm with many lock files", async () => {
    cwdSpy.mockReturnValue(testAllPath);

    expect(await cli.getDefaultPackageManager()).toBe("npm");
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should prioritize global npm over other package managers", async () => {
    cwdSpy.mockReturnValue(noLockPath);

    expect(await cli.getDefaultPackageManager()).toBe("npm");
    expect(syncMock).toHaveBeenCalledTimes(1);
  });

  it("should throw error if no package manager is found", async () => {
    cwdSpy.mockReturnValue(noLockPath);
    syncMock.mockImplementation(() => {
      throw new Error("error");
    });
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    // Do not print warning in CI
    const consoleMock = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(await cli.getDefaultPackageManager()).toBeFalsy();
    expect(mockExit).toHaveBeenCalledWith(2);
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(syncMock).toHaveBeenCalledTimes(3); // 3 calls for npm, yarn and pnpm
  });
});
