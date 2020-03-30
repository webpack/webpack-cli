jest.setMock('@webpack-cli/package-utils', {
    getPackageManager: jest.fn(),
});

import { getPackageManager } from "@webpack-cli/package-utils";
import addonGenerator from '../src/addon-generator';

describe('addon generator', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const Gen = addonGenerator([], '', [], [], () => {});
    const gen = new Gen(null, null);
    gen.scheduleInstallTask = jest.fn();
    const installMock = gen.scheduleInstallTask as jest.Mock;
    const packageMock = getPackageManager as jest.Mock;

    beforeEach(() => {
        installMock.mockClear();
    });

    it('schedules install using npm', () => {
        packageMock.mockReturnValue('npm');
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        gen.install();
        expect(installMock.mock.calls.length).toEqual(1);
        expect(installMock.mock.calls[0]).toEqual([
            'npm',
            ['webpack-defaults', 'bluebird'],
            {
                'save-dev': true,
            },
        ]);
    });

    it('schedules install using yarn', () => {
        packageMock.mockReturnValue('yarn');
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        gen.install();
        expect(installMock.mock.calls.length).toEqual(1);
        expect(installMock.mock.calls[0]).toEqual([
            'yarn',
            ['webpack-defaults', 'bluebird'],
            {
                'dev': true,
            },
        ]);
    });
});
