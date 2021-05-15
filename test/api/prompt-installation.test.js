"use strict";

const path = require("path");

// eslint-disable-next-line node/no-unpublished-require
const stripAnsi = require("strip-ansi");
const globalModulesNpmValue = "test-npm";
const utilsDirectory = path.resolve(__dirname, "../../packages/webpack-cli/lib/utils/");

jest.setMock("global-modules", globalModulesNpmValue);
jest.setMock(path.resolve(utilsDirectory, "./prompt"), jest.fn());
jest.setMock(path.resolve(utilsDirectory, "./run-command"), jest.fn());
jest.setMock(path.resolve(utilsDirectory, "./package-exists"), jest.fn());
jest.setMock(path.resolve(utilsDirectory, "./get-package-manager"), jest.fn());

const getPackageManager = require(path.resolve(utilsDirectory, "./get-package-manager"));
const packageExists = require(path.resolve(utilsDirectory, "./package-exists"));
const promptInstallation = require(path.resolve(utilsDirectory, "./prompt-installation"));
const runCommand = require(path.resolve(utilsDirectory, "./run-command"));
const prompt = require(path.resolve(utilsDirectory, "./prompt"));

describe("promptInstallation", () => {
    beforeAll(() => {
        packageExists.mockReturnValue(true);
    });
    beforeEach(() => {
        runCommand.mockClear();
        prompt.mockClear();
    });

    it("should prompt to install using npm if npm is package manager", async () => {
        prompt.mockReturnValue(true);

        getPackageManager.mockReturnValue("npm");

        const preMessage = jest.fn();
        const promptResult = await promptInstallation("test-package", preMessage);

        expect(promptResult).toBeTruthy();
        expect(preMessage.mock.calls.length).toEqual(1);
        expect(prompt.mock.calls.length).toEqual(1);
        expect(runCommand.mock.calls.length).toEqual(1);
        expect(stripAnsi(prompt.mock.calls[0][0].message)).toContain(
            "Would you like to install 'test-package' package? (That will run 'npm install -D test-package')",
        );

        // install the package using npm
        expect(runCommand.mock.calls[0][0]).toEqual("npm install -D test-package");
    });

    it("should prompt to install using yarn if yarn is package manager", async () => {
        prompt.mockReturnValue({ installConfirm: true });

        getPackageManager.mockReturnValue("yarn");

        const promptResult = await promptInstallation("test-package");

        expect(promptResult).toBeTruthy();
        expect(prompt.mock.calls.length).toEqual(1);
        expect(runCommand.mock.calls.length).toEqual(1);
        expect(stripAnsi(prompt.mock.calls[0][0].message)).toContain(
            "Would you like to install 'test-package' package? (That will run 'yarn add -D test-package')",
        );

        // install the package using yarn
        expect(runCommand.mock.calls[0][0]).toEqual("yarn add -D test-package");
    });

    it("should prompt to install using pnpm if pnpm is package manager", async () => {
        prompt.mockReturnValue({ installConfirm: true });

        getPackageManager.mockReturnValue("pnpm");

        const promptResult = await promptInstallation("test-package");

        expect(promptResult).toBeTruthy();
        expect(prompt.mock.calls.length).toEqual(1);
        expect(runCommand.mock.calls.length).toEqual(1);
        expect(stripAnsi(prompt.mock.calls[0][0].message)).toContain(
            "Would you like to install 'test-package' package? (That will run 'pnpm install -D test-package')",
        );

        // install the package using npm
        expect(runCommand.mock.calls[0][0]).toEqual("pnpm install -D test-package");
    });

    it("should support pre message", async () => {
        prompt.mockReturnValue({ installConfirm: true });

        getPackageManager.mockReturnValue("npm");

        const preMessage = jest.fn();
        const promptResult = await promptInstallation("test-package", preMessage);

        expect(promptResult).toBeTruthy();
        expect(preMessage.mock.calls.length).toEqual(1);
        expect(prompt.mock.calls.length).toEqual(1);
        expect(runCommand.mock.calls.length).toEqual(1);
        expect(stripAnsi(prompt.mock.calls[0][0].message)).toContain(
            "Would you like to install 'test-package' package? (That will run 'npm install -D test-package')",
        );

        // install the package using npm
        expect(runCommand.mock.calls[0][0]).toEqual("npm install -D test-package");
    });

    it("should not install if install is not confirmed", async () => {
        prompt.mockReturnValue(false);

        const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
        const promptResult = await promptInstallation("test-package");

        expect(promptResult).toBeUndefined();
        expect(prompt.mock.calls.length).toEqual(1);
        // runCommand should not be called, because the installation is not confirmed
        expect(runCommand.mock.calls.length).toEqual(0);
        expect(mockExit.mock.calls[0][0]).toEqual(2);

        mockExit.mockRestore();
    });
});
