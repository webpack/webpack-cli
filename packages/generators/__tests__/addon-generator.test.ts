jest.mock('webpack-cli/lib/utils/get-package-manager', () => jest.fn());

import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import addonGenerator from '../src/addon-generator';

import utils, { getPackageManager } from '../../webpack-cli/lib/utils';

describe('addon generator', () => {
    let gen, installMock, packageMock;
    const genName = 'test-addon';
    const testAssetsPath = path.join(__dirname, 'test-assets');
    const genPath = path.join(testAssetsPath, genName);
    // we want to test that the addon generator does not create a path
    // like ./test-assets/test-addon/test-addon
    // we call this unwanted path doubleGenPath
    const doubleGenPath = path.join(genPath, genName);

    afterAll(() => {
        rimraf.sync(testAssetsPath);
    });

    beforeEach(() => {
        const Gen = addonGenerator([], '', [], [], () => ({}));

        gen = new Gen(null, { cli: { utils } });
        gen.props = {
            name: genName,
        };
        gen.scheduleInstallTask = jest.fn();
        installMock = gen.scheduleInstallTask as jest.Mock;
    });

    it('schedules install using npm', () => {
        const defaultCwd = process.cwd();

        rimraf.sync(testAssetsPath);
        fs.mkdirSync(genPath, { recursive: true });

        // set the working directory to here so that the addon directory is
        // generated in ./test-assets/test-addon
        process.chdir(genPath);

        packageMock = getPackageManager as jest.Mock;
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

        process.chdir(defaultCwd);
    });

    it('schedules install using yarn', () => {
        const defaultCwd = process.cwd();

        rimraf.sync(testAssetsPath);
        fs.mkdirSync(genPath, { recursive: true });
        // set the working directory to here so that the addon directory is
        // generated in ./test-assets/test-addon
        process.chdir(genPath);

        packageMock = getPackageManager as jest.Mock;
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

        process.chdir(defaultCwd);
    });

    it('does not create new directory when current directory matches addon name', () => {
        const defaultCwd = process.cwd();

        rimraf.sync(testAssetsPath);
        fs.mkdirSync(genPath, { recursive: true });

        // set the working directory to here so that the addon directory is
        // generated in ./test-assets/test-addon
        process.chdir(genPath);

        packageMock = getPackageManager as jest.Mock;

        expect(fs.existsSync(genPath)).toBeTruthy();

        gen.default();

        expect(fs.existsSync(genPath)).toBeTruthy();
        expect(fs.existsSync(doubleGenPath)).toBeFalsy();

        // this needs to happen before the next test so that the
        // working directory is changed before we create the new
        // generator above
        // this is switching the working directory as follows:
        // ./test-assets/test-addon -> ./test-assets
        rimraf.sync(genPath);

        process.chdir(defaultCwd);
    });

    it('creates a new directory for the generated addon', () => {
        const defaultCwd = process.cwd();

        rimraf.sync(testAssetsPath);
        fs.mkdirSync(genPath, { recursive: true });

        // set the working directory to here so that the addon directory is
        // generated in ./test-assets/test-addon
        process.chdir(genPath);

        gen.default();

        expect(fs.existsSync(genPath)).toBeTruthy();
        expect(fs.existsSync(doubleGenPath)).toBeFalsy();

        process.chdir(defaultCwd);
    });
});
