"use strict";

const { stripVTControlCharacters } = require("node:util");
const CLI = require("../../packages/webpack-cli/lib/webpack-cli").default;

const readlineQuestionMock = jest.fn();

jest.unstable_mockModule("node:readline", () => ({
  createInterface: jest.fn().mockReturnValue({
    question: readlineQuestionMock,
    close: jest.fn().mockReturnValue(undefined),
  }),
}));

const spawnMock = jest.fn();

jest.unstable_mockModule("node:child_process", () => ({ spawnSync: spawnMock }));

/**
 * Checks the command which installs the package.
 * @param {string} packageManager package manager
 * @param {string[]} args arguments
 */
const expectInstallCommand = (packageManager, args) => {
  expect(spawnMock).toHaveBeenCalledTimes(1);

  if (process.platform === "win32") {
    // Package managers are `.cmd` files on Windows, so they run in a shell with escaped arguments
    expect(spawnMock).toHaveBeenCalledWith(
      [packageManager, ...args.map((arg) => `^"${arg}^"`)].join(" "),
      { stdio: "inherit", shell: true },
    );
  } else {
    expect(spawnMock).toHaveBeenCalledWith(packageManager, args, { stdio: "inherit" });
  }
};

describe("installPackage", () => {
  let cli;
  let getDefaultPackageManagerSpy;

  beforeEach(() => {
    cli = new CLI();

    getDefaultPackageManagerSpy = jest.spyOn(cli, "getDefaultPackageManager");
  });

  afterEach(() => {
    jest.clearAllMocks();

    getDefaultPackageManagerSpy.mockRestore();
  });

  it("should prompt to install using npm if npm is package manager", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("y"));
    getDefaultPackageManagerSpy.mockResolvedValue("npm");

    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBe("test-package");
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stripVTControlCharacters(readlineQuestionMock.mock.calls[0][0])).toContain(
      "Would you like to install 'test-package' package? (That will run 'npm install -D test-package')",
    );

    expectInstallCommand("npm", ["install", "-D", "test-package"]);
  });

  it("should prompt to install using yarn if yarn is package manager", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("y"));
    getDefaultPackageManagerSpy.mockReturnValue("yarn");

    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBe("test-package");
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stripVTControlCharacters(readlineQuestionMock.mock.calls[0][0])).toContain(
      "Would you like to install 'test-package' package? (That will run 'yarn add -D test-package')",
    );

    expectInstallCommand("yarn", ["add", "-D", "test-package"]);
  });

  it("should prompt to install using pnpm if pnpm is package manager", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("y"));
    getDefaultPackageManagerSpy.mockReturnValue("pnpm");

    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBe("test-package");
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stripVTControlCharacters(readlineQuestionMock.mock.calls[0][0])).toContain(
      "Would you like to install 'test-package' package? (That will run 'pnpm install -D test-package')",
    );

    expectInstallCommand("pnpm", ["install", "-D", "test-package"]);
  });

  it("should escape the arguments for the shell on Windows", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("y"));
    getDefaultPackageManagerSpy.mockReturnValue("npm");

    const platform = Object.getOwnPropertyDescriptor(process, "platform");

    Object.defineProperty(process, "platform", { value: "win32" });

    try {
      await cli.installPackage('a"b&c');
    } finally {
      Object.defineProperty(process, "platform", platform);
    }

    expect(spawnMock).toHaveBeenCalledWith('npm ^"install^" ^"-D^" ^"a\\^"b^&c^"', {
      stdio: "inherit",
      shell: true,
    });
  });

  it("should support pre message", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("y"));
    getDefaultPackageManagerSpy.mockReturnValue("npm");

    const preMessage = jest.fn();
    const installResult = await cli.installPackage("test-package", { preMessage });

    expect(installResult).toBe("test-package");
    expect(preMessage).toHaveBeenCalledTimes(1);
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stripVTControlCharacters(readlineQuestionMock.mock.calls[0][0])).toContain(
      "Would you like to install 'test-package' package? (That will run 'npm install -D test-package')",
    );

    expectInstallCommand("npm", ["install", "-D", "test-package"]);
  });

  it("should prompt to install and install using 'y'", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("y"));
    getDefaultPackageManagerSpy.mockReturnValue("npm");

    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBe("test-package");
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stripVTControlCharacters(readlineQuestionMock.mock.calls[0][0])).toContain(
      "Would you like to install 'test-package' package? (That will run 'npm install -D test-package')",
    );

    expectInstallCommand("npm", ["install", "-D", "test-package"]);
  });

  it("should prompt to install and install using 'yes'", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("yes"));
    getDefaultPackageManagerSpy.mockReturnValue("npm");

    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBe("test-package");
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stripVTControlCharacters(readlineQuestionMock.mock.calls[0][0])).toContain(
      "Would you like to install 'test-package' package? (That will run 'npm install -D test-package')",
    );

    expectInstallCommand("npm", ["install", "-D", "test-package"]);
  });

  it("should prompt to install and install using 'yEs'", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("yEs"));
    getDefaultPackageManagerSpy.mockReturnValue("npm");

    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBe("test-package");
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    expect(spawnMock).toHaveBeenCalledTimes(1);
    expect(stripVTControlCharacters(readlineQuestionMock.mock.calls[0][0])).toContain(
      "Would you like to install 'test-package' package? (That will run 'npm install -D test-package')",
    );

    expectInstallCommand("npm", ["install", "-D", "test-package"]);
  });

  it("should not install if install is not confirmed", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("n"));

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBeUndefined();
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    // runCommand should not be called, because the installation is not confirmed
    expect(spawnMock).not.toHaveBeenCalled();
    expect(mockExit.mock.calls[0][0]).toBe(2);

    mockExit.mockRestore();
  });

  it("should not install if install is not confirmed using 'n'", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("n"));

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBeUndefined();
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    // runCommand should not be called, because the installation is not confirmed
    expect(spawnMock).not.toHaveBeenCalled();
    expect(mockExit.mock.calls[0][0]).toBe(2);

    mockExit.mockRestore();
  });

  it("should not install if install is not confirmed using 'no'", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("no"));

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBeUndefined();
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    // runCommand should not be called, because the installation is not confirmed
    expect(spawnMock).not.toHaveBeenCalled();
    expect(mockExit.mock.calls[0][0]).toBe(2);

    mockExit.mockRestore();
  });

  it("should not install if install is not confirmed using 'no' #2", async () => {
    readlineQuestionMock.mockImplementation((_questionTest, cb) => cb("No"));

    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    const installResult = await cli.installPackage("test-package");

    expect(installResult).toBeUndefined();
    expect(readlineQuestionMock).toHaveBeenCalledTimes(1);
    // runCommand should not be called, because the installation is not confirmed
    expect(spawnMock).not.toHaveBeenCalled();
    expect(mockExit.mock.calls[0][0]).toBe(2);

    mockExit.mockRestore();
  });
});
