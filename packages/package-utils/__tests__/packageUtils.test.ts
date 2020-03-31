'use strict';

jest.mock('execa');
jest.mock('cross-spawn');
const globalModulesNpmValue = 'test-npm';
jest.setMock('global-modules', globalModulesNpmValue);
jest.setMock('enquirer', {
    prompt: jest.fn(),
});
jest.setMock('../lib/processUtils', {
    runCommand: jest.fn(),
});

import fs from 'fs';
import path from 'path';
import execa from 'execa';
import spawn from 'cross-spawn';
import { prompt } from 'enquirer';
import { getPackageManager, packageExists } from '../lib/packageUtils';
import { runCommand } from '../lib/processUtils';

describe('packageUtils', () => {
    describe('getPackageManager', () => {
        const testYarnLockPath = path.resolve(__dirname, 'test-yarn-lock');
        const testNpmLockPath = path.resolve(__dirname, 'test-npm-lock');
        const testBothPath = path.resolve(__dirname, 'test-both');

        const cwdSpy = jest.spyOn(process, 'cwd');

        beforeAll(() => {
            // mock sync
            execa.sync = jest.fn();

            // package-lock.json is ignored by .gitignore, so we simply
            // write a lockfile here for testing
            if (!fs.existsSync(testNpmLockPath)){
                fs.mkdirSync(testNpmLockPath);
            }
            fs.writeFileSync(path.resolve(testNpmLockPath, 'package-lock.json'), '');
            fs.writeFileSync(path.resolve(testBothPath, 'package-lock.json'), '');
        });

        beforeEach(() => {
            (execa.sync as jest.Mock).mockClear();
        });

        it('should find yarn.lock', () => {
            cwdSpy.mockReturnValue(testYarnLockPath);
            expect(getPackageManager()).toEqual('yarn');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(0);
        });

        it('should find package-lock.json', () => {
            cwdSpy.mockReturnValue(testNpmLockPath);
            expect(getPackageManager()).toEqual('npm');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(0);
        });

        it('should prioritize yarn with many lock files', () => {
            cwdSpy.mockReturnValue(testBothPath);
            expect(getPackageManager()).toEqual('yarn');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(0);
        });

        it('should use yarn if yarn command works', () => {
            // yarn should output a version number to stdout if
            // it is installed
            (execa.sync as jest.Mock).mockImplementation(() => {
                return {
                    stdout: '1.0.0'
                };
            });
            cwdSpy.mockReturnValue(path.resolve(__dirname));
            expect(getPackageManager()).toEqual('yarn');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(1);
        });

        it('should use npm if yarn command fails', () => {
            (execa.sync as jest.Mock).mockImplementation(() => {
                throw new Error();
            });
            cwdSpy.mockReturnValue(path.resolve(__dirname));
            expect(getPackageManager()).toEqual('npm');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(1);
        });
    });

    describe('getPathToGlobalPackages', () => {
        let packageUtils;
        beforeAll(() => {
            packageUtils = require('../lib/packageUtils');
            packageUtils.getPackageManager = jest.fn();
        });

        it('uses global-modules if package manager is npm', () => {
            packageUtils.getPackageManager.mockReturnValue('npm');
            expect(packageUtils.getPathToGlobalPackages()).toEqual(globalModulesNpmValue);
        });

        it('executes a command to find yarn global dir if package manager is yarn', () => {
            packageUtils.getPackageManager.mockReturnValue('yarn');
            (spawn.sync as jest.Mock).mockReturnValue({
                stdout: {
                    toString: (): string => {
                        return 'test-yarn';
                    },
                },
            });
            // after the yarn global dir is found, the node_modules directory
            // is added on to the path
            expect(packageUtils.getPathToGlobalPackages()).toEqual(`test-yarn${path.sep}node_modules`);
        });
    });

    describe('packageExists', () => {
        it('should check existence of package', () => {
            // use an actual path relative to the packageUtils file
            expect(packageExists('./processUtils')).toBeTruthy();
            expect(packageExists('./nonexistent-package')).toBeFalsy();
        });
    });

    describe('promptInstallation', () => {
        let packageUtils;
        beforeAll(() => {
            packageUtils = require('../lib/packageUtils');
            packageUtils.getPackageManager = jest.fn();
            packageUtils.packageExists = jest.fn(() => true);
        });

        beforeEach(() => {
            (runCommand as jest.Mock).mockClear();
            (prompt as jest.Mock).mockClear();
        });

        it('should prompt to install using npm if npm is package manager', async () => {
            packageUtils.getPackageManager.mockReturnValue('npm');
            (prompt as jest.Mock).mockReturnValue({
                installConfirm: true,
            });

            const preMessage = jest.fn();
            const promptResult = await packageUtils.promptInstallation('test-package', preMessage);
            expect(promptResult).toBeTruthy();
            expect(preMessage.mock.calls.length).toEqual(1);
            expect((prompt as jest.Mock).mock.calls.length).toEqual(1);
            expect((runCommand as jest.Mock).mock.calls.length).toEqual(1);
            expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test\-package\?/);
            // install the package using npm
            expect((runCommand as jest.Mock).mock.calls[0][0]).toEqual('npm install -D test-package');
        });

        it('should prompt to install using yarn if yarn is package manager', async () => {
            packageUtils.getPackageManager.mockReturnValue('yarn');
            (prompt as jest.Mock).mockReturnValue({
                installConfirm: true,
            });

            const promptResult = await packageUtils.promptInstallation('test-package');
            expect(promptResult).toBeTruthy();
            expect((prompt as jest.Mock).mock.calls.length).toEqual(1);
            expect((runCommand as jest.Mock).mock.calls.length).toEqual(1);
            expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test\-package\?/);
            // install the package using yarn
            expect((runCommand as jest.Mock).mock.calls[0][0]).toEqual('yarn add -D test-package');
        });

        it('should not install if install is not confirmed', async () => {
            packageUtils.getPackageManager.mockReturnValue('npm');
            (prompt as jest.Mock).mockReturnValue({
                installConfirm: false,
            });

            const promptResult = await packageUtils.promptInstallation('test-package');
            expect(promptResult).toBeUndefined();
            expect((prompt as jest.Mock).mock.calls.length).toEqual(1);
            // runCommand should not be called, because the installation is not confirmed
            expect((runCommand as jest.Mock).mock.calls.length).toEqual(0);
            expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test\-package\?/);
            expect(process.exitCode).toEqual(-1);
        });
    });
});
