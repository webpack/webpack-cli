const { mkdirSync, existsSync } = require('fs');
const { resolve } = require('path');
const rimraf = require('rimraf');
const { run } = require('../utils/test-utils');

const assetsPath = resolve(__dirname, './test-assets');

describe('init', () => {
    beforeEach(() => {
        mkdirSync(assetsPath);
    });

    afterEach(() => {
        rimraf.sync(assetsPath);
    });

    it('should generate default project when nothing is passed', () => {
        const { stdout, stderr } = run(assetsPath, ['init']);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('create webpack.config.js');

        // Test files
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(assetsPath, file)).toBeTruthy();
        });
    });

    it('should generate project when generationPath is supplied', () => {
        const { stdout, stderr } = run(__dirname, ['init', `--generation-path=${assetsPath}`]);
        console.log({ stdout, stderr });
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('create webpack.config.js');

        // Test files
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(assetsPath, file)).toBeTruthy();
        });
    });
});
