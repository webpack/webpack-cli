'use strict';

jest.mock('execa');
jest.mock('cross-spawn');
const globalModulesNpmValue = 'test-npm';
jest.setMock('global-modules', globalModulesNpmValue);
jest.setMock('enquirer', {
    prompt: jest.fn(),
});

jest.setMock('../lib/run-command', {
    runCommand: jest.fn(),
});

jest.setMock('../lib/package-exists', {
    packageExists: jest.fn(),
});

jest.setMock('../lib/get-package-manager', {
    getPackageManager: jest.fn(),
});

import { getPackageManager, packageExists, promptInstallation, runCommand } from '../';
import { prompt } from 'enquirer';

describe('promptInstallation', () => {
    beforeAll(() => {
        (packageExists as jest.Mock).mockReturnValue(true);
    });
    beforeEach(() => {
        (runCommand as jest.Mock).mockClear();
        (prompt as jest.Mock).mockClear();
    });

    it('should prompt to install using npm if npm is package manager', async () => {
        (prompt as jest.Mock).mockReturnValue({
            installConfirm: true,
        });
        (getPackageManager as jest.Mock).mockReturnValue('npm');
        const preMessage = jest.fn();
        const promptResult = await promptInstallation('test-package', preMessage);
        expect(promptResult).toBeTruthy();
        expect(preMessage.mock.calls.length).toEqual(1);
        expect((prompt as jest.Mock).mock.calls.length).toEqual(1);
        expect((runCommand as jest.Mock).mock.calls.length).toEqual(1);
        expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test-package\?/);
        // install the package using npm
        expect((runCommand as jest.Mock).mock.calls[0][0]).toEqual('npm install -D test-package');
    });

    it('should prompt to install using yarn if yarn is package manager', async () => {
        (prompt as jest.Mock).mockReturnValue({
            installConfirm: true,
        });
        (getPackageManager as jest.Mock).mockReturnValue('yarn');

        const promptResult = await promptInstallation('test-package');
        expect(promptResult).toBeTruthy();
        expect((prompt as jest.Mock).mock.calls.length).toEqual(1);
        expect((runCommand as jest.Mock).mock.calls.length).toEqual(1);
        expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test-package\?/);
        // install the package using yarn
        expect((runCommand as jest.Mock).mock.calls[0][0]).toEqual('yarn add -D test-package');
    });

    it('should not install if install is not confirmed', async () => {
        (prompt as jest.Mock).mockReturnValue({
            installConfirm: false,
        });

        const promptResult = await promptInstallation('test-package');
        expect(promptResult).toBeUndefined();
        expect((prompt as jest.Mock).mock.calls.length).toEqual(1);
        // runCommand should not be called, because the installation is not confirmed
        expect((runCommand as jest.Mock).mock.calls.length).toEqual(0);
        expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test-package\?/);
        expect(process.exitCode).toEqual(2);
    });
});
