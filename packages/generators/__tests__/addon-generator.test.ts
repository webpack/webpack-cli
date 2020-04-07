jest.setMock('@webpack-cli/package-utils', {
    getPackageManager: jest.fn(),
});

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import { getPackageManager } from '@webpack-cli/package-utils';
import addonGenerator from '../src/addon-generator';

describe('addon generator', () => {
    let gen, installMock, packageMock;
    const genName = 'test-addon';
    const testAssetsPath = path.join(__dirname, 'test-assets');
    const genPath = path.join(testAssetsPath, genName);
    // we want to test that the addon generator does not create a path
    // like ./test-assets/test-addon/test-addon
    // we call this unwanted path doubleGenPath
    const doubleGenPath = path.join(genPath, genName);

    beforeAll(() => {
        rimraf.sync(testAssetsPath);
        mkdirp.sync(genPath);
        // set the working directory to here so that the addon directory is
        // generated in ./test-assets/test-addon
        process.chdir(genPath);
        packageMock = getPackageManager as jest.Mock;
    });

    afterAll(() => {
        rimraf.sync(testAssetsPath);
    });

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const Gen = addonGenerator([], '', [], [], () => {});
        gen = new Gen(null, null);
        gen.props = {
            name: genName,
        };
        gen.scheduleInstallTask = jest.fn();
        installMock = gen.scheduleInstallTask as jest.Mock;
    });

    it('schedules install using npm', () => {
        packageMock.mockReturnValue('npm');

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

        gen.install();
        expect(installMock.mock.calls.length).toEqual(1);
        expect(installMock.mock.calls[0]).toEqual([
            'yarn',
            ['webpack-defaults', 'bluebird'],
            {
                dev: true,
            },
        ]);
    });

    it('does not create new directory when current directory matches addon name', () => {
        expect(fs.existsSync(genPath)).toBeTruthy();
        gen.default();
        expect(fs.existsSync(genPath)).toBeTruthy();
        expect(fs.existsSync(doubleGenPath)).toBeFalsy();

        // this needs to happen before the next test so that the
        // working directory is changed before we create the new
        // generator above
        // this is switching the working directory as follows:
        // ./test-assets/test-addon -> ./test-assets
        process.chdir(testAssetsPath);
        rimraf.sync(genPath);
    });

    it('creates a new directory for the generated addon', () => {
        expect(fs.existsSync(genPath)).toBeFalsy();
        gen.default();
        expect(fs.existsSync(genPath)).toBeTruthy();
        expect(fs.existsSync(doubleGenPath)).toBeFalsy();
    });
});
