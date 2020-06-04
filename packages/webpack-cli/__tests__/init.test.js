/* eslint-disable node/no-extraneous-require */
const { sync: spawnSync } = require('execa');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const genPath = path.resolve(__dirname, './test-assets');
const firstPrompt = 'Will your application have multiple bundles?';

jest.setTimeout(60000);

describe('init', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    afterAll(() => {
        rimraf.sync(genPath);
    });

    it('should work with cli', () => {
        const { stdout, stderr } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['init'], {
            cwd: genPath,
            reject: false,
        });
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });
    it('should run with cli when auto is supplied', () => {
        const { stdout } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['init', '--auto'], {
            cwd: genPath,
            reject: false,
        });
        // Test no prompts are present
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(path.resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./sw.js', './package.json', './src/index.js'];

        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(path.resolve(genPath, file))).toBeTruthy();
        });

        // Check package json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(path.join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });
});
