const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { join, resolve } = require('path');
const { run } = require('../../utils/test-utils');

const genPath = path.resolve(__dirname, './test-assets');
const firstPrompt = 'Will your application have multiple bundles?';

const successLog = `You can now run 'yarn build' to bundle your application!`;

describe('init auto flag', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    it('should prompt with w/o auto flag', () => {
        const { stdout, stderr } = run(genPath, ['init'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold and not prompt with auto flag', () => {
        const { stdout } = run(genPath, ['init', '--auto'], false);
        // Test no prompts are present
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./package.json', './src/index.js', './webpack.config.js'];

        files.forEach((file) => {
            expect(fs.existsSync(resolve(genPath, file))).toBeTruthy();
        });

        const webpackConfig = require(join(genPath, 'webpack.config.js'));

        expect(webpackConfig.modules.rules).toEqual([]);

        // Check package json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack-dev-server']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
            expect(pkgJson['scripts']['serve'] == 'webpack serve').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();

        // Check we are not logging twice
        expect(stdout.split(successLog).length - 1).toBe(1);
    });
});
