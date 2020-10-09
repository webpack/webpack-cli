'use strict';

import { packageExists, promptInstallation, runCommand } from '../';
import ExternalCommand from '../../webpack-cli/lib/commands/resolveCommand';

describe('@webpack-cli/utils', () => {
    it('should check existence of package', () => {
        // use an actual path relative to the packageUtils file
        expect(packageExists('../lib/package-exists')).toBeTruthy();
        expect(packageExists('./nonexistent-package')).toBeFalsy();
    });

    it('should not throw if the user interrupts', async () => {
        (promptInstallation as jest.Mock).mockImplementation(() => {
            throw new Error();
        });
        await expect(ExternalCommand.run('info')).resolves.not.toThrow();
    });
});

describe('promptInstallation', () => {
    let packageUtils;
    beforeAll(() => {
        packageUtils = require('../lib/');
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
        expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test-package\?/);
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
        expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test-package\?/);
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
        expect((prompt as jest.Mock).mock.calls[0][0][0].message).toMatch(/Would you like to install test-package\?/);
        expect(process.exitCode).toEqual(2);
    });
});
