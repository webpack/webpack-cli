const { mkdirSync, existsSync } = require('fs');
const { resolve } = require('path');
const rimraf = require('rimraf');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const assetsPath = resolve(__dirname, './test-assets');
const ENTER = '\x0D';

describe('init command', () => {
    beforeEach(() => {
        mkdirSync(assetsPath);
    });

    afterEach(() => {
        rimraf.sync(assetsPath);
    });

    it('should generate default project when nothing is passed', () => {
        const { stdout, stderr } = run(assetsPath, ['init', '--use-defaults']);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should generate project when generationPath is supplied', () => {
        const { stdout, stderr } = run(__dirname, ['init', '--use-defaults', `--generation-path=${assetsPath}`]);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should generate folders if non existing generation path is given', () => {
        rimraf.sync(assetsPath);
        const { stdout, stderr } = run(__dirname, ['init', '--use-defaults', `--generation-path=${assetsPath}`]);
        expect(stdout).toContain("generation path doesn't exist, required folders will be created.");
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });

    it('should ask question when wrong template is supplied', async () => {
        const { stdout, stderr } = await runPromptWithAnswers(assetsPath, ['init', '--use-defaults', '--template=apple'], [`${ENTER}`]);
        expect(stdout).toContain('Project has been initialised with webpack!');
        expect(stderr).toContain('webpack.config.js');

        // Test files
        const files = ['package.json', 'src', 'src/index.js', 'webpack.config.js'];
        files.forEach((file) => {
            expect(existsSync(resolve(assetsPath, file))).toBeTruthy();
        });
    });
});
